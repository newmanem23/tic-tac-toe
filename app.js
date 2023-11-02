const gameBoard = (function(doc) {
    const boardArray = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];
    const boardElement = doc.querySelector('#board');
    const renderBoard = () => {
        boardElement.innerHTML = '';
        for ([index, value] of boardArray.entries()) {
            const tile = doc.createElement('div')
            tile.classList.add('tile');
            tile.innerHTML = value;
            tile.dataset.index = index;
            boardElement.appendChild(tile);
        }
    }
    return {
        renderBoard,
    }
})(document);

const btn = document.querySelector('#render-button');
btn.addEventListener("click", () => {
    gameBoard.renderBoard();
});

