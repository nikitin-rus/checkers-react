import { useState } from "react";
import { getRowsCopy } from "../utils";
import Row from "./Row";

export default function Board({ rows, isPlayerBlack, onMove }) {
    const [clickableCells, setClickableCells] = useState([]);
    const [destroyedCells, setDestroyedCells] = useState([]);
    const [chosenCells, setChosenCells] = useState([]);
    const moveDirections = {
        'w': [[-1, -1], [-1, 1]],
        'b': [[1, -1], [1, 1]],
        'wk': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
        'bk': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    };
    const jumpDirections = {
        'w': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
        'b': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
        'wk': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
        'bk': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    };

    function getCellsToChoose() {
        const coords = [];

        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                const color = rows[i][j];

                if (
                    (
                        (
                            !isPlayerBlack &&
                            (color === 'w' || color === 'wk')
                        ) ||
                        (
                            isPlayerBlack &&
                            (color === 'b' || color === 'bk')
                        )
                    ) &&
                    (
                        getCellsToMove(color, i, j).length ||
                        getCellsToJump(color, i, j).length
                    )
                ) {
                    coords.push([i, j]);
                }
            }
        }

        return coords;
    }

    // TODO: Добавить перемещение дамок

    function getCellsToMove(color, rowIndex, columnIndex) {
        const cellsToMove = [];

        if (color !== 'wk' && color !== 'bk') {
            moveDirections[color].forEach(([rowDelta, columnDelta]) => {
                const targetColor = rows[rowIndex + rowDelta]?.[columnIndex + columnDelta];

                if (targetColor === null) {
                    cellsToMove.push([rowIndex + rowDelta, columnIndex + columnDelta]);
                }
            });
        }

        return cellsToMove;
    }

    function getCellsToJump(color, rowIndex, columnIndex) {
        const cellsToJump = [];

        if (color !== 'wk' && color !== 'bk') {
            jumpDirections[color].forEach(([rowDelta, columnDelta]) => {
                const victimColor = rows[rowIndex + rowDelta]?.[columnIndex + columnDelta];
                const targetColor = rows[rowIndex + rowDelta * 2]?.[columnIndex + columnDelta * 2];

                if (
                    victimColor !== null &&
                    victimColor !== color &&
                    targetColor === null
                ) {
                    cellsToJump.push([rowIndex + rowDelta * 2, columnIndex + columnDelta * 2]);
                }
            });
        }

        return cellsToJump;
    }

    function handleCellClick(rowIndex, columnIndex, isClickable, hasChecker) {
        if (!isClickable) return;

        if (hasChecker) {
            const cellsToChoose = getCellsToChoose();
            const cellsToMove = getCellsToMove(rows[rowIndex][columnIndex], rowIndex, columnIndex);
            const cellsToJump = getCellsToJump(rows[rowIndex][columnIndex], rowIndex, columnIndex);

            setClickableCells([...cellsToChoose, ...cellsToMove, ...cellsToJump]);
            setChosenCells([...chosenCells, [rowIndex, columnIndex]]);
        } else {
            const [chosenRowIndex, chosenColumnIndex] = chosenCells[chosenCells.length - 1];

            let destroyedRowIndex = null;
            let destroyedColumnIndex = null;

            const signRow = Math.sign(rowIndex - chosenRowIndex);
            const signColumn = Math.sign(columnIndex - chosenColumnIndex);

            for (
                let i = chosenRowIndex + signRow,
                j = chosenColumnIndex + signColumn;
                i !== rowIndex && j !== columnIndex;
                i += signRow,
                j += signColumn
            ) {
                // console.log(`${i}-${j}`);
                if (rows[i][j] !== null) {
                    [destroyedRowIndex, destroyedColumnIndex] = [i, j];
                    setDestroyedCells([...destroyedCells, [i, j]]);
                }
            }

            if (destroyedRowIndex && destroyedColumnIndex) {
                const chosenColor = rows[chosenCells[0][0]][chosenCells[0][1]];

                const cellsToJump = getCellsToJump(chosenColor, rowIndex, columnIndex)
                    .filter(([rowIndex, columnIndex]) => {
                        return chosenCells.some(([chosenRowIndex, chosenColumnIndex]) => {
                            return (
                                rowIndex === chosenRowIndex &&
                                columnIndex === chosenColumnIndex
                            );
                        }) === false;
                    });

                if (cellsToJump.length) {
                    setClickableCells(cellsToJump);
                    setChosenCells([...chosenCells, [rowIndex, columnIndex]]);
                } else {
                    const copy = getRowsCopy(rows);

                    copy[chosenCells[0][0]][chosenCells[0][1]] = null;
                    copy[rowIndex][columnIndex] = chosenColor;

                    for (const [i, j] of destroyedCells) {
                        copy[i][j] = null;
                    }

                    copy[destroyedRowIndex][destroyedColumnIndex] = null;

                    onMove(copy);
                    setClickableCells([]);
                    setDestroyedCells([]);
                    setChosenCells([]);
                }
            } else {
                const copy = getRowsCopy(rows);
                
                copy[chosenRowIndex][chosenColumnIndex] = null;
                copy[rowIndex][columnIndex] = rows[chosenRowIndex][chosenColumnIndex];
                
                onMove(copy);
                setClickableCells([]);
                setChosenCells([]);
            }
        }
    }

    // FIXME: Если getCellsToChoose возвращает пустой массив, то рендер компонента зацикливается 
    if (!clickableCells.length) {
        const cellsToChoose = getCellsToChoose();
        console.log(cellsToChoose);

        if (!cellsToChoose.length) {
            // Игра окончена
        } else {
            setClickableCells(cellsToChoose);
        }
    }

    return (
        <div className="board">
            {rows.map((row, i) => {
                const isFirstCellBeige = (i % 2 !== 0);

                return (
                    <Row
                        key={i}
                        cells={row}
                        rowIndex={i}
                        clickableCells={clickableCells}
                        chosenCells={chosenCells}
                        isFirstCellBeige={isFirstCellBeige}
                        isPlayerBlack={isPlayerBlack}
                        onCellClick={handleCellClick}
                    />
                );
            })}
        </div>
    );
}