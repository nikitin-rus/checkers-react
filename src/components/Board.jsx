import { useState } from "react";
import { getRowsCopy } from "../utils";
import Row from "./Row";
import CoordinatesBar from "./CoordinatesBar";

export default function Board({ rows, isPlayerBlack, isInViewMode, onMove, onEnd }) {
    const [clickableCells, setClickableCells] = useState([]);
    const [chosenCell, setChosenCell] = useState(null);
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
                        getCellsToMove(rows, color, i, j).length ||
                        getCellsToJump(rows, color, i, j).length
                    )
                ) {
                    coords.push([i, j]);
                }
            }
        }

        return coords;
    }

    function getCellsToMove(rows, color, rowIndex, columnIndex) {
        const cellsToMove = [];

        if (color === 'w' || color === 'b') {
            moveDirections[color].forEach(([rowDirection, columnDirection]) => {
                const targetColor = rows[rowIndex + rowDirection]?.[columnIndex + columnDirection];

                if (targetColor === null) {
                    cellsToMove.push([rowIndex + rowDirection, columnIndex + columnDirection]);
                }
            });
        }

        if (color === 'wk' || color === 'bk') {
            moveDirections[color].forEach(([rowDirection, columnDirection]) => {
                let i = rowIndex + rowDirection;
                let j = columnIndex + columnDirection;

                while (rows[i] && rows[i][j] === null) {
                    cellsToMove.push([i, j]);

                    i += rowDirection;
                    j += columnDirection;
                }
            });
        }

        return cellsToMove;
    }

    function getCellsToJump(rows, color, rowIndex, columnIndex) {
        const cellsToJump = [];

        if (color === 'w' || color === 'b') {
            jumpDirections[color].forEach(([rowDirection, columnDirection]) => {
                const victimColor = rows[rowIndex + rowDirection]?.[columnIndex + columnDirection];
                const targetColor = rows[rowIndex + rowDirection * 2]?.[columnIndex + columnDirection * 2];

                if (
                    victimColor !== null &&
                    victimColor !== color &&
                    targetColor === null
                ) {
                    cellsToJump.push([rowIndex + rowDirection * 2, columnIndex + columnDirection * 2]);
                }
            });
        }

        if (color === 'wk' || color === 'bk') {
            jumpDirections[color].forEach(([rowDirection, columnDirection]) => {
                let i = rowIndex + rowDirection;
                let j = columnIndex + columnDirection;

                // console.group();
                // console.log(`Direction (${rowDirection} : ${columnDirection})`);

                let isEnemyMet = false;
                while (!isEnemyMet && rows[i] && rows[i][j] !== undefined) {
                    // console.log(`Checking cell on coordinates (${i} : ${j}). Color: ${rows[i][j]}`);
                    if (
                        (color === 'wk' && ['b', 'bk'].includes(rows[i][j])) ||
                        (color === 'bk' && ['w', 'wk'].includes(rows[i][j]))
                    ) {
                        isEnemyMet = true;
                    }

                    i += rowDirection;
                    j += columnDirection;
                }

                // console.log(`Is enemy met: (${isEnemyMet})`);
                // console.groupEnd();

                while (isEnemyMet && rows[i] && rows[i][j] === null) {
                    cellsToJump.push([i, j]);
                    i += rowDirection;
                    j += columnDirection;
                }
            });
        }

        return cellsToJump;
    }

    function handleCellClick(rowIndex, columnIndex, isClickable, hasChecker) {
        if (!isClickable) return;

        if (hasChecker) {
            const cellsToChoose = getCellsToChoose();
            const cellsToMove = getCellsToMove(rows, rows[rowIndex][columnIndex], rowIndex, columnIndex);
            const cellsToJump = getCellsToJump(rows, rows[rowIndex][columnIndex], rowIndex, columnIndex);

            setClickableCells([...cellsToChoose, ...cellsToMove, ...cellsToJump]);
            setChosenCell([rowIndex, columnIndex]);
        } else {
            const copy = getRowsCopy(rows);
            const [chosenRowIndex, chosenColumnIndex] = chosenCell;
            const chosenColor = rows[chosenRowIndex][chosenColumnIndex];

            const rowDirection = Math.sign(rowIndex - chosenRowIndex);
            const columnDirection = Math.sign(columnIndex - chosenColumnIndex);

            copy[chosenRowIndex][chosenColumnIndex] = null;
            copy[rowIndex][columnIndex] = chosenColor;

            if (
                rows[rowIndex + rowDirection] === undefined &&
                (chosenColor === "w" || chosenColor === "b")
            ) {
                copy[rowIndex][columnIndex] = (
                    chosenColor === "w" ? "wk" : "bk"
                );
            }

            let i = chosenRowIndex + rowDirection;
            let j = chosenColumnIndex + columnDirection;

            let isJump = false;

            while (i !== rowIndex && j !== columnIndex) {
                // console.log(`${i}-${j}`);
                if (rows[i][j] !== null) {
                    // console.log(`Шашка по координатам ${i}-${j} была перепрыгнута`);
                    copy[i][j] = null;
                    isJump = true;
                }
                i += rowDirection;
                j += columnDirection;
            }

            let cellsToJump = [];
            if (isJump) cellsToJump = getCellsToJump(copy, copy[rowIndex][columnIndex], rowIndex, columnIndex);

            if (isJump && cellsToJump.length) {
                onMove(copy, isPlayerBlack);
                setClickableCells(cellsToJump);
                setChosenCell([rowIndex, columnIndex]);
            } else {
                onMove(copy, !isPlayerBlack);
                setClickableCells([]);
                setChosenCell(null);
            }
        }
    }

    if (!clickableCells.length && !isInViewMode) {
        const cellsToChoose = getCellsToChoose();

        if (!cellsToChoose.length) {
            onEnd();
        } else {
            setClickableCells(cellsToChoose);
        }
    }

    if (clickableCells.length && isInViewMode) {
        setClickableCells([]);
    }

    return (
        <div className="board">
            <div className="board__coordinates-x">
                <CoordinatesBar isHorizontal={true} />
                <div className="board__coordinates-y">
                    <CoordinatesBar />
                    <div className="board__rows">
                        {rows.map((row, i) => {
                            const isFirstCellBeige = (i % 2 !== 0);

                            return (
                                <Row
                                    key={i}
                                    cells={row}
                                    rowIndex={i}
                                    clickableCells={clickableCells}
                                    chosenCell={chosenCell}
                                    isFirstCellBeige={isFirstCellBeige}
                                    isPlayerBlack={isPlayerBlack}
                                    onCellClick={handleCellClick}
                                />
                            );
                        })}
                    </div>
                    <CoordinatesBar />
                </div>
                <CoordinatesBar isHorizontal={true} />
            </div>
        </div>
    );
}