import Cell from "./Cell";

export default function Row({
    cells,
    rowIndex,
    clickableCells,
    chosenCell,
    isFirstCellBeige = false,
    isPlayerBlack = false,
    onCellClick,
}) {
    return (
        <div className="row">
            {cells.map((cell, columnIndex) => {
                const isCellBeige = isFirstCellBeige ?
                    (columnIndex % 2 === 0) :
                    (columnIndex % 2 !== 0);

                const isCellClickable = clickableCells.some(([clickableRowIndex, clickableColumnIndex]) => {
                    return (
                        clickableRowIndex === rowIndex &&
                        clickableColumnIndex === columnIndex
                    );
                });

                const isCellChosen = (
                    chosenCell &&
                    chosenCell[0] === rowIndex &&
                    chosenCell[1] === columnIndex
                );

                const isCellHasChecker = !!cell;
                const isCellCheckerBlack = cell === "b" || cell === "bk";
                const isCellCheckerKing = cell === "wk" || cell === "bk";

                return (
                    <Cell
                        key={columnIndex}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        isBeige={isCellBeige}
                        isClickable={isCellClickable}
                        isChosen={isCellChosen}
                        isPlayerBlack={isPlayerBlack}
                        hasChecker={isCellHasChecker}
                        isCheckerBlack={isCellCheckerBlack}
                        isCheckerKing={isCellCheckerKing}
                        onClick={onCellClick}
                    />
                );
            })}
        </div>
    );
}