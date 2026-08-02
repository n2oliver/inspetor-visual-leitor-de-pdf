import { reader } from "./reader";

const pathSplit = window.location.pathname.split('/');
const fileName = pathSplit[pathSplit.length-1];

const speakEndedEvent = new CustomEvent("speakEnded");

const styleNode = document.createElement("style");
styleNode.textContent = `/* Remove as setas no Chrome, Safari e Edge */
input.leitorPDF::-webkit-outer-spin-button,
input.leitorPDF::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Remove as setas no Firefox */
input.leitorPDF[type=number] {
    -moz-appearance: textfield;
}`;
document.body.appendChild(styleNode);

()=>(async ()=>{
    if(!chrome.storage) {
        return;
    }
    await chrome.storage.local.set({'leitor_pdf_bloqueado': false});
    localStorage.setItem('leitor_pdf_bloqueado', false);
})();

reader.run();

export { speakEndedEvent }