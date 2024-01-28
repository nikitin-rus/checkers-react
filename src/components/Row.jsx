import Cell from "./Cell";

export default function Row({
    cells,
    rowIndex,
    clickableCells,
    chosenChecker,
    isFirstCellBeige = false,
    isPlayerBlack = false,
    onCellClick
}) {
    return (
        <div className="row">
            {cells.map((cell, columnIndex) => {
                const isCellBeige = isFirstCellBeige ?
                    (columnIndex % 2 === 0) :
                    (columnIndex % 2 !== 0)

                let isClickable = false;
                for (const [i, j] of clickableCells) {
                    if (i === rowIndex && j === columnIndex) {
                        isClickable = true;
                    }
                }

                return (
                    <Cell
                        key={columnIndex}
                        isBeige={isCellBeige}
                        isClickable={isClickable}
                        isChosen={
                            chosenChecker &&
                            chosenChecker[0] === rowIndex &&
                            chosenChecker[1] === columnIndex
                        }
                        isPlayerBlack={isPlayerBlack}
                        hasChecker={!!cell}
                        isCheckerBlack={cell === "b"}
                        onClick={() => onCellClick(rowIndex, columnIndex, isClickable)}
                    />
                );
            })}
        </div>
    );
}