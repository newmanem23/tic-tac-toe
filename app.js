const GameBoard = (() => {
    const board = new Array(9);

    const getBoard = () => board;
    
    const selectTile = (index, player) => {
        if (!board[index]) {
            board[index] = player.marker
        }
    }

    const printBoard = () => {
        console.log(board);
    }

    const resetBoard = () => {
        for(const [index, value] of board.entries()) {
            board[index] = undefined;
        }
    }
    
    return {
        getBoard,
        selectTile,
        printBoard,
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

    const setPlayerNames = (playerNames)  => {
        players[0].name = playerNames.xPlayerName;
        players[1].name = playerNames.oPlayerName;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (index) => {
        console.log(`${getActivePlayer().name} has placed ${getActivePlayer().marker} in index ${index}.`)
        GameBoard.selectTile(index, getActivePlayer());
        const gameResult = checkGameOver();
        if (!gameResult) {
            switchPlayerTurn();
            return;
        }
        ScreenController.endGame(gameResult)
    }

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
    const boardDiv = document.querySelector('#board');
    const board = GameBoard.getBoard();
    const configForm = document.querySelector('#config');
    const dialog = document.querySelector('dialog');
    const message = document.querySelector('.message');
    const playAgainBtn = document.querySelector('#play-again');

    configForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formElements = e.target.elements
        configForm.style.display = "none";
        const playerNames = {
            xPlayerName: formElements["player-x"].value,
            oPlayerName: formElements["player-o"].value
        }
        GameController.setPlayerNames(playerNames);
        updateBoard();
    });

    playAgainBtn.addEventListener("click", () => {
        dialog.close();
        configForm.reset();
        GameController.restartGame();
        updateBoard();
    })

    const updateBoard = () => {
        // Clear the board
        boardDiv.innerHTML = '';
        
        for (const [index, value] of board.entries()) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = index;
            if (value) {
                tile.innerHTML = value;
            }
            tile.addEventListener("click", clickHandler)
            boardDiv.appendChild(tile);
        }
    }

    const endGame = (gameResult) => {
        if (gameResult === 'tie') {
            message.innerHTML = "It's a tie!"
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

