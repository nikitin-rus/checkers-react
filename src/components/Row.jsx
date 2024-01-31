import Cell from "./Cell";

export default function Row({
    cells,
    rowIndex,
    clickableCells,
    chosenCells,
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

                const isCellChosen = chosenCells.some(([chosenRowIndex, chosenColumnIndex]) => {
                    return (
                        chosenRowIndex === rowIndex &&
                        chosenColumnIndex === columnIndex
                    );
                });

                const isCellHasChecker = !!cell;
                const isCellCheckerBlack = cell === "b" || cell === "bk";

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
                        onClick={onCellClick}
                    />
                );
            })}
        </div>
    );
}