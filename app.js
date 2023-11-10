const GameBoard = (() => {
    // Initialize board Array
    const board = new Array(9);

    // Exposed function to return board
    const getBoard = () => board;
    
    // Assign value to tile based on player
    const selectTile = (index, player) => {
        if (!board[index]) {
            board[index] = player.marker;
        }
    }

    // Reset board to all undefined for new game
    const resetBoard = () => {
        for(const [index, value] of board.entries()) {
            board[index] = undefined;
        }
    }
    
    return {
        getBoard,
        selectTile,
        resetBoard
    }
})();


const GameController = (() => {
    // Players array with player objects within
    const players =  [{marker: 'X'}, {marker: 'O'}];
    let activePlayer = players[0];

    // Switch player turn function
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Set player names based on form submission
    const setPlayerNames = (playerNames)  => {
        players[0].name = playerNames.xPlayerName;
        players[1].name = playerNames.oPlayerName;
    }

    // Public function to get active player
    const getActivePlayer = () => activePlayer;

    // Place tile and check for game result.
    const playRound = (index) => {
        GameBoard.selectTile(index, getActivePlayer());
        const gameResult = checkGameOver();
        if (!gameResult) {
            switchPlayerTurn();
            return;
        }
        ScreenController.endGame(gameResult)
    }

    // Returns winning player, 'tie', or false so the game continues
    const checkGameOver = () => {
        const board = GameBoard.getBoard();
        // Possible win scenarios
        const wins = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [3, 4, 5],
            [6, 7, 8],
            [2, 4, 6]
        ];
        // Check for a winner
        for (const win of wins) {
            if (board[win[0]] === board[win[1]] &&
                board[win[0]] === board[win[2]] &&
                board[win[0]] === activePlayer.marker) {
                console.log(`${activePlayer.name} Wins!`);
                return activePlayer;
            }   
        }
        // Check for a tie
        if (!board.includes(undefined)){
            console.log("It's a tie!");
            return 'tie';
        }
        // Return False if game isn't over.
        return false;
    };

    // Set start player and reset the board
    const restartGame = () => {
        activePlayer = players[0];
        GameBoard.resetBoard();
    }

    return {
        playRound,
        getActivePlayer,
        restartGame,
        setPlayerNames
    };
})();

const ScreenController = (() => {
    // Initiate elements
    const board = GameBoard.getBoard();
    const boardDiv = document.querySelector('#board');
    const turn = document.querySelector('.turn');
    const configForm = document.querySelector('#config');
    const dialog = document.querySelector('dialog');
    const message = document.querySelector('.message');
    const playAgainBtn = document.querySelector('#play-again');
    const menuBtn = document.querySelector('#menu');

    // Set listener for the player names form
    configForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hide the form
        configForm.style.display = "none";
        // Set player names
        const formElements = e.target.elements;
        const playerNames = {
            xPlayerName: formElements["player-x"].value,
            oPlayerName: formElements["player-o"].value
        };
        GameController.setPlayerNames(playerNames);
        updateBoard();
        configForm.reset();
    });

    // Set listener for the play again button
    playAgainBtn.addEventListener("click", () => {
        dialog.close();
        GameController.restartGame();
        updateBoard();
    });

    // Set listener for menu button
    menuBtn.addEventListener("click", () => {
        dialog.close();
        boardDiv.innerHTML = '';
        turn.innerHTML = '';
        configForm.style.display = 'flex';
    });

    const updateBoard = () => {
        // Clear the board and identify who's turn it is
        boardDiv.innerHTML = '';
        turn.innerHTML = `${GameController.getActivePlayer().name}'s turn`
        
        // Populate tile divs with the board
        for (const [index, value] of board.entries()) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = index;
            if (value) {
                tile.innerHTML = value;
            }
            tile.addEventListener("click", clickHandler);
            boardDiv.appendChild(tile);
        }
    }

    const endGame = (gameResult) => {
        if (gameResult === 'tie') {
            message.innerHTML = "It's a tie!";
        } else {
            message.innerHTML = `${gameResult.name} wins!`;
        }
        dialog.showModal();
    }

    const clickHandler = (e) => {
        const index = e.target.dataset.index;
        if (!board[index]){
            GameController.playRound(index);
            updateBoard();
        }
    }
    return {endGame};
})();

