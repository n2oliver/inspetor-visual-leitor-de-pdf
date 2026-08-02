import { pauseButtonId } from "./pause-button";
import { playButtonId } from "./play-button";
import { cancelSpeak } from "./speaker";

const stopButtonId = "parar-de-ouvir";
function stopButton() {
    const stopButton = document.createElement('div');
    const stopStyles = {
        width: '48px',
        height: '48px',
        backgroundColor: 'darkred',
        color: 'red',
        position: 'fixed',
        borderRadius: '50%',
        bottom: '24px',
        right: '72px',
        marginRight: '8px',
        marginBottom: '8px',
        outline: 'outset',
        zIndex: "99999999",
        cursor: "pointer",
    }
    stopButton.id = stopButtonId;
    stopButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 6h8v8H8z"/>
    </svg>`;
    Object.assign(stopButton.style, stopStyles);
    document.body.appendChild(stopButton);
    document.getElementById(stopButtonId).addEventListener('click', (event) => {
        const playButtonElement = document.getElementById(playButtonId);
        const pauseButtonElement = document.getElementById(pauseButtonId);
        pauseButtonElement.style.display = 'none';
        playButtonElement.style.display = 'block';
        cancelSpeak();
    });
}
export { stopButton, stopButtonId };