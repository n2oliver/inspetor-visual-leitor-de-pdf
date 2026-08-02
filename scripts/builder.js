import { fileField } from "./file-field.js";
import { playButton } from "./play-button.js";
import { pauseButton } from "./pause-button.js";
import { stopButton } from "./stop-button.js";
import { book } from "./book.js";
import { to } from "./to.js";
import { from } from "./from.js";
import { rate } from "./rate.js";

function buildLeitorDePDF() {
    window.onmousemove = null;
    window.focus();
    const fromElement = from();
    const toElement = to();
    book(fromElement, toElement);
    playButton();
    pauseButton();
    stopButton();
    fileField();
    rate();
}
export { buildLeitorDePDF };