export default function Coordinate({ value, isHorizontal = false }) {
    return (
        <div className={"coordinate" +
            (isHorizontal ? " horizontal" : "")
        }>
            {value}
        </div>
    );
}