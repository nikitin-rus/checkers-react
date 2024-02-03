import { useState } from "react";
import Board from "./Board";

export default function Game() {
    // const [history, setHistory] = useState([[
    //     [null, 'b', null, null, null, 'b', null, 'b'],
    //     ['b', null, 'b', null, 'w', null, 'b', null],
    //     [null, 'b', null, null, null, null, null, 'b'],
    //     [null, null, 'b', null, null, null, 'b', null],
    //     [null, null, null, null, null, null, null, null],
    //     ['w', null, 'w', null, 'w', null, 'w', null],
    //     [null, 'w', null, 'w', null, 'w', null, 'w'],
    //     ['w', null, 'w', null, 'w', null, 'w', null],
    // ]]);
    const [history, setHistory] = useState([[
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, 'b', null, null, null],
        [null, null, null, 'w', null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
    ]]);
    const [isPlayerBlack, setIsPlayerBlack] = useState(false);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const currentMove = history.length - 1;

    return (
        <div className="game">
            <Board
                rows={history[currentMove]}
                isPlayerBlack={isPlayerBlack}
                onMove={(rows, isPlayerBlack) => {
                    setHistory([...history, rows]);
                    setIsPlayerBlack(isPlayerBlack);
                }}
                onEnd={() => {
                    setIsGameEnded(true);
                }}
            />

            <div className={
                "game__info" +
                (
                    (
                        (!isGameEnded && isPlayerBlack) ||
                        (isGameEnded && !isPlayerBlack)
                    ) ? " black" : ""
                )
            }>
                {isGameEnded ? (
                    <p className="game__win-msg">
                        {(isPlayerBlack ? "White's" : "Black's") + " win!"}
                    </p>
                ) : (
                    <p className="game__move-msg">
                        {`${(isPlayerBlack ? "Black's" : "White's")} turn. Move #${currentMove + 1}`}
                    </p>
                )}
            </div>
        </div>
    );
}