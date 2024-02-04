export default function Button({ value, isDisabled, onClick }) {
    return (
        <button className="button"
            disabled={isDisabled}
            onClick={onClick}>
            {value}
        </button>
    );
}