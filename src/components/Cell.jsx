import Checker from "./Checker";

export default function Cell({
    isBeige = false,
    isClickable = false,
    isPlayerBlack = false,
    hasChecker = false,
    isCheckerBlack = false,
    isCheckerKing = false,
}) {
    return (
        <div className={'cell' +
            (isBeige ? " beige" : "") +
            (isClickable ? " clickable" : "") +
            (isPlayerBlack ? " player-black" : "")
        }>
            {hasChecker && (
                <Checker
                    isBlack={isCheckerBlack}
                    isStarShown={isCheckerKing}>
                </Checker>
            )}
        </div>
    );
}