import { useState } from "react";
import Row from "./Row";

export default function Board({ rows, isPlayerBlack }) {
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

    function findClickableCells(isPlayerBlack) {
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
                        findMoves(i, j).length ||
                        findJumps(i, j).length
                    )
                ) {
                    coords.push([i, j]);
                }
            }
        }

        return coords;
    }

    function findMoves(rowIndex, columnIndex) {
        const moves = [];
        const checker = rows[rowIndex][columnIndex];

        if (checker !== 'wk' && checker !== 'bk') {
            moveDirections[checker].forEach(([rowDelta, columnDelta]) => {
                if (rows[rowIndex + rowDelta]?.[columnIndex + columnDelta] === null) {
                    moves.push([rowIndex + rowDelta, columnIndex + columnDelta]);
                }
            });
        }

        return moves;
    }

    function findJumps(rowIndex, columnIndex) {
        const jumps = [];
        const checker = rows[rowIndex][columnIndex];

        if (checker !== 'wk' && checker !== 'bk') {
            jumpDirections[checker].forEach(([rowDelta, columnDelta]) => {
                const victim = rows[rowIndex + rowDelta]?.[columnIndex + columnDelta];
                const target = rows[rowIndex + rowDelta * 2]?.[columnIndex + columnDelta * 2];

                if (
                    victim &&
                    victim !== checker &&
                    target === null
                ) {
                    jumps.push({
                        victim: [rowIndex + rowDelta, columnIndex + columnDelta],
                        target: [rowIndex + rowDelta * 2, columnIndex + columnDelta * 2],
                    });
                }
            });
        }

        return jumps;
    }

    if (!clickableCells.length) {
        setClickableCells(findClickableCells(isPlayerBlack));
    }

    function handleCellClick(rowIndex, columnIndex, isClickable) {
        const checker = rows[rowIndex][columnIndex];

        if (isClickable && checker) {
            const coords = findClickableCells(isPlayerBlack);
            const moves = findMoves(rowIndex, columnIndex);
            const jumps = findJumps(rowIndex, columnIndex); 

            setChosenChecker([rowIndex, columnIndex]);
            setClickableCells(coords.concat(moves).concat(jumps.map(jump => jump.target)));
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