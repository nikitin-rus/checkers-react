import { useEffect, useState } from "react";
import Board from "./Board";
import Button from "./Button";

export default function Game() {
    const [history, setHistory] = useState([[
        [null, 'b', null, 'b', null, 'b', null, 'b'],
        ['b', null, 'b', null, 'b', null, 'b', null],
        [null, 'b', null, 'b', null, 'b', null, 'b'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, 'wk', null, null],
        ['w', null, 'w', null, 'w', null, 'w', null],
        [null, 'w', null, 'w', null, 'w', null, 'w'],
        ['w', null, 'w', null, 'w', null, 'w', null],
    ]]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isPlayerBlack, setIsPlayerBlack] = useState(false);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const isInViewMode = currentMove < history.length - 1;

    function handleToStartClick() {
        setCurrentMove(0);
    }

    function handleToEndClick() {
        setCurrentMove(history.length - 1);
    }

    function handlePreviousClick() {
        setCurrentMove(currentMove - 1);
    }

    function handleNextClick() {
        setCurrentMove(currentMove + 1);
    }

    return (
        <div className="game">
            <div className="game__items-top">
                <Board
                    rows={history[currentMove]}
                    isPlayerBlack={isPlayerBlack}
                    isInViewMode={isInViewMode}
                    onMove={(rows, isPlayerBlack) => {
                        setHistory([...history, rows]);
                        setCurrentMove(history.length);
                        setIsPlayerBlack(isPlayerBlack);
                    }}
                    onEnd={() => {
                        setIsGameEnded(true);
                    }}
                />

                <div className="game__buttons">
                    <Button
                        value={"To start"}
                        isDisabled={currentMove === 0}
                        onClick={handleToStartClick}
                    />
                    <Button
                        value={"Previous"}
                        isDisabled={currentMove === 0}
                        onClick={handlePreviousClick}
                    />
                    <Button
                        value={"Next"}
                        isDisabled={currentMove === history.length - 1}
                        onClick={handleNextClick}
                    />
                    <Button
                        value={"To end"}
                        isDisabled={currentMove === history.length - 1}
                        onClick={handleToEndClick}
                    />
                </div>
            </div>

            <div className={
                "game__info" +
                (
                    (
                        (!isGameEnded && isPlayerBlack) ||
                        (isGameEnded && !isPlayerBlack)
                    ) ? " black" : ""
                )
            }>
                <p className="game__msg">
                    {isInViewMode ? (
                        `View Mode. Move #${currentMove + 1}`
                    ) : (
                        isGameEnded ? (
                            `${isPlayerBlack ? "White's" : "Black's"} win!`
                        ) : (
                            `${isPlayerBlack ? "Black's" : "White's"} turn. Move #${currentMove + 1}`
                        )
                    )}
                </p>
            </div>
        </div>
    );
}