import Row from "./Row";
import Cell from "./Cell";

export default function Board() {
    let rows = [];
    for (let i = 0; i < 8; i++) {
        rows.push(new Array(8).fill(null));
    }

    for (let i = 0; i < 8; i++) {
        if (i >= 3 && i <= 4) continue;
        
        const isRowStartWithChecker = i % 2 === 0;

        for (let j = 0; j < rows[i].length; j++) {
            if (
                (isRowStartWithChecker && j % 2 === 0) ||
                (!isRowStartWithChecker && j % 2 !== 0)
            ) {
                rows[i][j] = i < 3 ? "b" : "w";
            }
        }
    }

    return (
        <div className="board">
            {rows.map((row, i) => {
                const isFirstCellBeige = (i % 2 !== 0);

                return (
                    <Row
                        key={i}
                        cells={row.map((cell, j) => {
                            const isCellBeige = isFirstCellBeige ?
                                (j % 2 === 0) :
                                (j % 2 !== 0)

                            return (
                                <Cell
                                    key={j}
                                    isBeige={isCellBeige}
                                    hasChecker={!!cell}
                                    isCheckerBlack={rows[i][j] === "b"}>
                                </Cell>
                            );
                        })}>
                    </Row>
                );
            })}
        </div>
    );
}