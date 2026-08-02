import { fileField } from "./components/file-field.js";
import { playButton } from "./components/play-button.js";
import { pauseButton } from "./components/pause-button.js";
import { stopButton } from "./components/stop-button.js";
import { book } from "./components/book.js";
import { to } from "./components/to.js";
import { from } from "./components/from.js";
import { rate } from "./components/rate.js";

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