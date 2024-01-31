import { useState } from "react";
import Board from "./Board";

export default function Game() {
    const [history, setHistory] = useState([[
        [null, 'b', null, 'b', null, 'b', null, 'b'],
        ['b', null, 'b', null, 'b', null, 'b', null],
        [null, 'b', null, 'b', null, 'b', null, 'b'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['w', null, 'w', null, 'w', null, 'w', null],
        [null, 'w', null, 'w', null, 'w', null, 'w'],
        ['w', null, 'w', null, 'w', null, 'w', null],
    ]]);
    const currentMove = history.length - 1;
    const isPlayerBlack = currentMove % 2 !== 0;

    return (
        <div className="game">
            <Board
                rows={history[currentMove]}
                isPlayerBlack={isPlayerBlack}
                onMove={rows => {
                    setHistory([...history, rows]);
                }}
            />
            <div className={
                "game__subtitle" +
                (isPlayerBlack ? " black" : "")
            }>
                {`${(isPlayerBlack ? "Black's" : "White's")} turn. Move #${currentMove + 1}`}
            </div>
        </div>
    );
}