const gameBoard = (function(doc) {
    const boardArray = Array.apply("", Array(9));
    const boardElement = doc.querySelector('#board');
    const renderBoard = () => {
        boardElement.innerHTML = '';
        for ([index, value] of boardArray.entries()) {
            const tile = doc.createElement('div')
            tile.classList.add('tile');
            if (value) {
                tile.innerHTML = value;
            }
            tile.dataset.index = index;
            tile.addEventListener("click", (e) => {
                selectTile(e);
            });
            boardElement.appendChild(tile);
        }
    }
    const selectTile = (e) => {
        const index = e.srcElement.dataset.index;
        console.log(index);
        console.log(boardArray[index]);

        if (!boardArray[index]) {
            boardArray[index] = 'X';
            console.log(boardArray);
            gameBoard.renderBoard();
        }
    }
    return {
        renderBoard,
    }
})(document);

gameBoard.renderBoard();

