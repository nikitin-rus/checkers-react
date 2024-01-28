import Checker from "./Checker";

export default function Cell({
    rowIndex,
    columnIndex,
    isBeige = false,
    isClickable = false,
    isChosen = false,
    isPlayerBlack = false,
    hasChecker = false,
    isCheckerBlack = false,
    isCheckerKing = false,
    onClick,
}) {

    return (
        <div className={'cell' +
            (isBeige ? " beige" : "") +
            (isClickable ? " clickable" : "") +
            (isChosen ? " chosen" : "") +
            (isPlayerBlack ? " player-black" : "")
        } onClick={() => onClick(rowIndex, columnIndex, isClickable, hasChecker)}>
            {hasChecker && (
                <Checker
                    isBlack={isCheckerBlack}
                    isStarShown={isCheckerKing}>
                </Checker>
            )}
        </div>
    );
}