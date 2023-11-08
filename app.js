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


    const printNewRound = () => {
        GameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (index) => {
        console.log(`${getActivePlayer().name} has placed ${getActivePlayer().marker} in index ${index}.`)
        GameBoard.selectTile(index, getActivePlayer());

        switchPlayerTurn();
        printNewRound();
    }

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
            tile.innerHTML = value;
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