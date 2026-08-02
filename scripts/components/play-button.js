import { reader } from "../reader";
import { fromId } from "./from";
import { pauseButtonId } from "./pause-button";
import { toId } from "./to";

const playButtonId = "ouvir-pdf";
function playButton() {
    const playButton = document.createElement('div');
    const playStyles = {
        width: '60px',
        height: '60px',
        backgroundColor: 'darkgreen',
        color: 'forestgreen',
        position: 'fixed',
        borderRadius: '50%',
        bottom: '24px',
        right: '0px',
        marginRight: '8px',
        marginBottom: '8px',
        outline: 'outset',
        zIndex: "99999999",
        cursor: "pointer",
    }
    playButton.id = playButtonId;
    playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
            10-4.48 10-10S17.52 2 12 2zm-2 14V8l6 4-6 4z"/>
    </svg>`;

    Object.assign(playButton.style, playStyles);
    document.body.appendChild(playButton);

    const playButtonElement = document.getElementById(playButtonId);

    playButtonElement.addEventListener('click', (event) => {
        const pauseButtonElement = document.getElementById(pauseButtonId);
        playButtonElement.style.display = 'none';
        pauseButtonElement.style.display = 'block';
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return;
        }
        const fromElement = document.getElementById(fromId);
        const toElement = document.getElementById(toId);
        reader.lerPDF(window.location.href, fromElement.value, toElement.value);
    });
    playButtonElement.addEventListener('speakEnded', (event) => {
        const pauseButtonElement = document.getElementById(pauseButtonId);
        pauseButtonElement.style.display = 'none';
        playButtonElement.style.display = 'block';
    });
}
export { playButton, playButtonId };