import Coordinate from "./Coordinate";

export default function CoordinatesBar({ isHorizontal = false }) {
    const coordinates = [];

    for (let i = 0; i < 8; i++) {
        coordinates.push(
            <Coordinate
                key={i}
                value={isHorizontal ? String.fromCharCode(65 + i) : 8 - i}
                isHorizontal={isHorizontal}>
            </Coordinate>
        );
    }

    return (
        isHorizontal ? (
            <div className={"coordinates-bar horizontal"}>
                <div className="coordinates-bar__empty-square"></div>
                {coordinates}
                <div className="coordinates-bar__empty-square"></div>
            </div>
        ) : (
            <div className="coordinates-bar">
                {coordinates}
            </div>
        )
    );
}