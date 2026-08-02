import { reader } from "./reader";

const pathSplit = window.location.pathname.split('/');
const fileName = pathSplit[pathSplit.length-1];

const speakEndedEvent = new CustomEvent("speakEnded");

()=>(async ()=>{
    if(!chrome.storage) {
        return;
    }
    await chrome.storage.local.set({'leitor_pdf_bloqueado': false});
    localStorage.setItem('leitor_pdf_bloqueado', false);
})();

reader.run();

export { speakEndedEvent }