import { BLACK, WHITE } from "../vars";

export default function Checker({ isBlack = false, isStarShown = false }) {
    return (
        <div className={isBlack ? "checker--black" : "checker"}>
            {isStarShown && (
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L14.6941 8.2918H23.4126L16.3592 13.4164L19.0534 21.7082L12 16.5836L4.94654 21.7082L7.6407 13.4164L0.58728 8.2918H9.30579L12 0Z"
                        fill={isBlack ? BLACK : WHITE}
                    />
                </svg>)}
        </div>
    );
}