export default function Button({value, isDisabled}) {
    return (
        <button className="button" disabled={isDisabled}>
            {value}
        </button>
    );
}