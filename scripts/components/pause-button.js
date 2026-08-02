import { playButtonId } from "./play-button";

const pauseButtonId = "pausar-pdf";
function pauseButton() {
    const pauseButton = document.createElement('div');
    const pauseStyles = {
        width: '60px',
        height: '60px',
        backgroundColor: 'orange',
        color: 'darkorange',
        position: 'fixed',
        borderRadius: '50%',
        bottom: '24px',
        right: '0px',
        marginRight: '8px',
        marginBottom: '8px',
        outline: 'outset',
        display: 'none',
        zIndex: "99999998",
        cursor: "pointer",
    }

    pauseButton.id = pauseButtonId;
    pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 5h3v10H8zm5 0h3v10h-3z"/>
    </svg>`;

    Object.assign(pauseButton.style, pauseStyles);
    document.body.appendChild(pauseButton);
    const pauseButtonElement = document.getElementById(pauseButtonId);
    pauseButtonElement.addEventListener('click', (event) => {
        const playButtonElement = document.getElementById(playButtonId);
        pauseButtonElement.style.display = 'none';
        playButtonElement.style.display = 'block';
        window.speechSynthesis.pause();
    });
}
export { pauseButton, pauseButtonId };