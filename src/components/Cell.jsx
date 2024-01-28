import Checker from "./Checker";

export default function Cell({
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
        } onClick={onClick}>
            {hasChecker && (
                <Checker
                    isBlack={isCheckerBlack}
                    isStarShown={isCheckerKing}>
                </Checker>
            )}
        </div>
    );
}