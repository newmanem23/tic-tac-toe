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
    
    return {
        getBoard,
        selectTile,
        printBoard,
    }
})();


const GameController = (() => {
    // Players array with player objects within
    const players = [
        {
            name: 'Player',
            marker: 'X'
        },
        {
            name: 'Computer',
            marker: 'O'
        }
    ];
    let activePlayer = players[0];

    // Switch player turn function
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Returns active player
    const getActivePlayer = () => activePlayer;

    const playRound = (index) => {
        console.log(`${getActivePlayer().name} has placed ${getActivePlayer().marker} in index ${index}.`)
        GameBoard.selectTile(index, getActivePlayer());
        const gameIsOver = checkGameOver();
        if (!gameIsOver) {
            switchPlayerTurn();
        }
    }

    const checkGameOver = () => {
        const board = GameBoard.getBoard();
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
                return true;
            }   
        }
        // Check for a tie
        if (!board.includes(undefined)){
            console.log("It's a tie!");
            return true;
        }
    };

    return {
        playRound,
        getActivePlayer,
    };
})();

const ScreenController = (() => {
    const boardDiv = document.querySelector('#board');
    const board = GameBoard.getBoard()

    const updateScreen = () => {
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

    const clickHandler = (e) => {
        const index = e.target.dataset.index;
        if (!board[index]){
            GameController.playRound(index);
            updateScreen();
        }
    }

    // Initial render
    updateScreen();
})();