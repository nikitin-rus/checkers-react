import { useState } from "react";
import { getRowsCopy } from "../utils";
import Row from "./Row";

export default function Board({ rows, isPlayerBlack, onMove }) {
    const [chosenChecker, setChosenChecker] = useState(null);
    const [clickableCells, setClickableCells] = useState([]);
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

    function getClickableCells() {
        const coords = [];

        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                const checker = rows[i][j];

                if (
                    (
                        (
                            !isPlayerBlack &&
                            (checker === 'w' || checker === 'wk')
                        ) ||
                        (
                            isPlayerBlack &&
                            (checker === 'b' || checker === 'bk')
                        )
                    ) &&
                    (
                        getCellsToMove(i, j).length
                    )
                ) {
                    coords.push([i, j]);
                }
            }
        }

        return coords;
    }

    function getCellsToMove(rowIndex, columnIndex) {
        const cellsToMove = [];
        const color = rows[rowIndex][columnIndex];

        if (color !== 'wk' && color !== 'bk') {
            moveDirections[color].forEach(([rowDelta, columnDelta]) => {
                const targetColor = rows[rowIndex + rowDelta]?.[columnIndex + columnDelta];

                if (targetColor === null) {
                    cellsToMove.push([rowIndex + rowDelta, columnIndex + columnDelta]);
                }
            });
            jumpDirections[color].forEach(([rowDelta, columnDelta]) => {
                const victimColor = rows[rowIndex + rowDelta]?.[columnIndex + columnDelta];
                const targetColor = rows[rowIndex + rowDelta * 2]?.[columnIndex + columnDelta * 2];

                if (
                    victimColor !== null &&
                    victimColor !== color &&
                    targetColor === null
                ) {
                    cellsToMove.push([rowIndex + rowDelta * 2, columnIndex + columnDelta * 2]);
                }
            });
        }

        return cellsToMove;
    }

    // function getCellsToJump(rowIndex, columnIndex) {
    //     const jumps = [];
    //     const checker = rows[rowIndex][columnIndex];

    //     if (checker !== 'wk' && checker !== 'bk') {
    //         jumpDirections[checker].forEach(([rowDelta, columnDelta]) => {
    //             const victim = rows[rowIndex + rowDelta]?.[columnIndex + columnDelta];
    //             const target = rows[rowIndex + rowDelta * 2]?.[columnIndex + columnDelta * 2];

    //             if (
    //                 victim &&
    //                 victim !== checker &&
    //                 target === null
    //             ) {
    //                 jumps.push({
    //                     victim: [rowIndex + rowDelta, columnIndex + columnDelta],
    //                     target: [rowIndex + rowDelta * 2, columnIndex + columnDelta * 2],
    //                 });
    //             }
    //         });
    //     }

    //     return jumps;
    // }

    function handleCellClick(rowIndex, columnIndex, isClickable, hasChecker) {
        if (!isClickable) return;
        if (hasChecker) {
            setChosenChecker({
                rowIndex: rowIndex,
                columnIndex: columnIndex,
                color: rows[rowIndex][columnIndex],
            });

            const clickableCells = getClickableCells();
            const cellsToMove = getCellsToMove(rowIndex, columnIndex);
            setClickableCells([...clickableCells, ...cellsToMove]);
        } else {
            const {
                rowIndex: chosenRowIndex,
                columnIndex: chosenColumnIndex,
                color: chosenColor
            } = chosenChecker;

            const copy = getRowsCopy(rows);

            copy[chosenRowIndex][chosenColumnIndex] = null;
            copy[rowIndex][columnIndex] = chosenColor;

            const signRow = Math.sign(rowIndex - chosenRowIndex);
            const signColumn = Math.sign(columnIndex - chosenColumnIndex);

            for (
                let i = chosenRowIndex + signRow,
                j = chosenColumnIndex + signColumn;
                i !== rowIndex && j !== columnIndex;
                i += signRow,
                j += signColumn
            ) {
                if (rows[i][j] !== null) {
                    copy[i][j] = null;
                }
            }

            onMove(copy);

            setClickableCells([]);
            setChosenChecker(null);
        }
    }

    if (!clickableCells.length) {
        setClickableCells(getClickableCells());
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
                        chosenChecker={chosenChecker}
                        isFirstCellBeige={isFirstCellBeige}
                        isPlayerBlack={isPlayerBlack}
                        onCellClick={handleCellClick}
                    />
                );
            })}
        </div>
    );
}