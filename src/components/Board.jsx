import { useState } from "react";
import { getRowsCopy } from "../utils";
import Row from "./Row";

export default function Board({ rows, isPlayerBlack, onMove }) {
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

        if (color === 'wk' || color === 'bk') {
            console.log(moveDirections[color]);
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
            setChosenCell([rowIndex, columnIndex]);
        } else {
            const copy = getRowsCopy(rows);
            const [chosenRowIndex, chosenColumnIndex] = chosenCell;
            const chosenColor = rows[chosenRowIndex][chosenColumnIndex];

            const rowDirection = Math.sign(rowIndex - chosenRowIndex);
            const columnDirection = Math.sign(columnIndex - chosenColumnIndex);

            copy[chosenRowIndex][chosenColumnIndex] = null;
            copy[rowIndex][columnIndex] = chosenColor;

            if (rows[rowIndex + rowDirection] === undefined) {
                copy[rowIndex][columnIndex] = chosenColor === "w" ? "wk" : "bk";
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
            if (isJump) cellsToJump = getCellsToJump(copy[rowIndex][columnIndex], rowIndex, columnIndex);

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

    // FIXME: Если getCellsToChoose возвращает пустой массив, то рендер компонента зацикливается 
    if (!clickableCells.length) {
        const cellsToChoose = getCellsToChoose();

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
                        chosenCell={chosenCell}
                        isFirstCellBeige={isFirstCellBeige}
                        isPlayerBlack={isPlayerBlack}
                        onCellClick={handleCellClick}
                    />
                );
            })}
        </div>
    );
}