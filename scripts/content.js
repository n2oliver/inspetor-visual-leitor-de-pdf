import { extractText, getDocumentProxy } from "unpdf";
import { speak, cancelSpeak } from "./speaker.js";

const fileFieldId = "file-field";
const playButtonId = "ouvir-pdf";
const pauseButtonId = "pausar-pdf";
const stopButtonId = "parar-de-ouvir";
const livroId = "livro";
const deId = "de";
const ateId = "ate";

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

async function lerPDF(url, from, to) {
    const input = document.getElementById(fileFieldId);
    let file = input.files[0];
    let fileBytes;
    if(window.location.protocol == 'file:' && file && !decodeURI(window.location.href).endsWith(file.name)) {
        alert("Para uma boa leitura, lembre-se de selecionar o mesmo .pdf que está aberto no navegador.");
    }
    try {
        if(window.location.protocol == 'file:') {
            fileBytes = await file.arrayBuffer();
        }
        // Fetch a PDF from the web or load it from the file system
        const buffer = window.location.protocol != 'file:' ? await fetch(url)
            .then(res => res.arrayBuffer()) : fileBytes;
        
        if(!buffer) {
            return;
        }
        const pdf = await getDocumentProxy(new Uint8Array(buffer));

        let mergePages = true;
        if(!from && !to) {
            mergePages = true;
        } else {
            mergePages = false;
        }
        const { totalPages, text } = await extractText(pdf, {mergePages});
        let finalText = text;
        if(from || to) {
            finalText = "";
            for(let i = from || 1; i <= (to || totalPages ? parseInt(to || totalPages) : text.length); i++) {
                finalText += text[i-1] + '\n';
            }
        }
        speak(finalText);
    } catch(e) {
        alert("Primeiro selecione o .pdf no campo 'Escolher arquivo'.");
        document.getElementById(playButtonId).style.display = "block";
        document.getElementById(pauseButtonId).style.display = "none";
        
        return;
    }
}

const ehPDF = window.location.href.substring(window.location.href.length-4) == '.pdf';
let currentTab = {};

()=>(async ()=>{
    if(!chrome.storage) {
        return;
    }
    await chrome.storage.local.set({'leitor_pdf_bloqueado': false});
    localStorage.setItem('leitor_pdf_bloqueado', false);
})();

window.addEventListener('load', async () => {
    if(!chrome.storage) {
        return;
    }
    const result = await chrome.storage.local.get(["insp_visual_ligado"]);
    if(ehPDF && result.insp_visual_ligado) {
        buildLeitorDePDF();
    }
    
    currentTab = await chrome.storage.local.get(['tabId']);
    
    window.focus();
    window.addEventListener("keydown", eventos);
    
    // Fetch a PDF from the web or load it from the file system
    if(window.location.protocol != 'file:') {
        const buffer = await fetch(window.location.href)
            .then(res => res.arrayBuffer());
        
        if(!buffer) {
            return;
        }
        const pdf = await getDocumentProxy(new Uint8Array(buffer));

        mergePages = false;
        const { totalPages, text } = await extractText(pdf, {mergePages});
        listarPaginas(totalPages);
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    sendResponse({ status: "success" });
    if (request.action === "ocultar") {
        ocultarLeitorDePDF();
    }
    if (request.action === "exibir") {
        exibirLeitorDePDF();
    }

    return true;
});

async function listarPaginas(totalPages) {
    const de = document.getElementById(deId);
    const ate = document.getElementById(ateId);
    
    let pages = "";
    for(let i = 1; i <= totalPages; i++) {
        pages += `<option value="${i}">${i}</option>`
    }
    de.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("from")}:</option>${ pages }`;
    ate.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("to")}:</option>${ pages }`;
}
async function eventos(event) {
    if(event && event.keyCode == 79 && event.altKey && event.shiftKey) {
        const hideState = await chrome.storage.local.get(['leitor_pdf_ocultar']);
        if(hideState.leitor_pdf_ocultar) {
            chrome.storage.local.set({leitor_pdf_ocultar: false});
            exibirLeitorDePDF();
        } else {
            chrome.storage.local.set({leitor_pdf_ocultar: true});
            chrome.storage.local.set({leitor_pdf_bloqueado: false});
            localStorage.setItem("leitor_pdf_bloqueado", false);
            ocultarLeitorDePDF();
            
            chrome.runtime.sendMessage({
                action: "ocultar",
                dados: { targetElementId: (event || window.event).target.id }
            }, (resposta) => {
            });
        }
    }
}
function ocultarLeitorDePDF() {
    if(ehPDF) {
        const fileField = document.getElementById(fileFieldId);
        const playButton = document.getElementById(playButtonId);
        const pauseButton = document.getElementById(pauseButtonId);
        const stopButton = document.getElementById(stopButtonId);
        const livro = document.getElementById(livroId);
        const de = document.getElementById(deId);
        const ate = document.getElementById(ateId);

        if(fileField) {
            fileField.style.display = 'none';
        }
        if(playButton) {
            playButton.style.display = 'none';
        }
        if(pauseButton) {
            pauseButton.style.display = 'none';
        }
        if(stopButton) {
            stopButton.style.display = 'none';
        }
        if(livro) {
            livro.style.display = 'none';
        }
        if(de) {
            de.style.display = 'none';
        }
        if(ate) {
            ate.style.display = 'none';
        }
    }
}
async function exibirLeitorDePDF() {
    const result = await chrome.storage.local.get(["insp_visual_ligado"]);
    if(ehPDF && result.insp_visual_ligado) {
        if(!document.getElementById(playButtonId)) {
            buildLeitorDePDF();
        }
        const fileField = document.getElementById(fileFieldId);
        const playButton = document.getElementById(playButtonId);
        const pauseButton = document.getElementById(pauseButtonId);
        const stopButton = document.getElementById(stopButtonId);
        const livro = document.getElementById(livroId);
        const de = document.getElementById(deId);
        const ate = document.getElementById(ateId);

        if(fileField && window.location.protocol == 'file:') {
            fileField.style.display = 'block';
        }
        if(playButton && 'speechSynthesis' in window && !speechSynthesis.paused) {
            playButton.style.display = 'block';
        }
        if(pauseButton && 'speechSynthesis' in window && speechSynthesis.paused) {
            pauseButton.style.display = 'block';
        }
        if(stopButton) {
            stopButton.style.display = 'block';
        }
        if(livro) {
            livro.style.display = 'block';
        }
        if(de) {
            de.style.display = 'block';
        }
        if(ate) {
            ate.style.display = 'block';
        }
    }
}
function buildLeitorDePDF() {
    window.onmousemove = null;
    window.focus();

    const livroStyles = {
        width: "108px",
        height: "66px",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 108 66'%3E%3Cpath d='M2 6 Q28 1 54 9 Q80 1 106 6 V58 Q80 53 54 64 Q28 53 2 58 Z' fill='white' stroke='%23666' stroke-width='1.5'/%3E%3Cline x1='54' y1='9' x2='54' y2='64' stroke='%23666' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        position: "fixed",
        bottom: "68px",
        right: "8px",
        zIndex: "99999998",
    };

    const deStyles = {
        position: "absolute",
        left: "8px",
        top: "10px",
        width: "40px",
        height: "40px",
        textAlign: "center",
        zIndex: "99999999",
        cursor: "pointer",
    }
    const ateStyles = {
        position: "absolute",
        left: "60px",
        top: "10px",
        width: "40px",
        height: "40px",
        textAlign: "center",
        zIndex: "99999999",
        cursor: "pointer",
    }

    const playStyles = {
        width: '60px',
        height: '60px',
        backgroundColor: 'darkgreen',
        color: 'forestgreen',
        position: 'fixed',
        borderRadius: '50%',
        bottom: '0px',
        right: '0px',
        marginRight: '8px',
        marginBottom: '8px',
        outline: 'outset',
        zIndex: "99999999",
        cursor: "pointer",
    }
    
    const pauseStyles = {
        width: '60px',
        height: '60px',
        backgroundColor: 'orange',
        color: 'darkorange',
        position: 'fixed',
        borderRadius: '50%',
        bottom: '0px',
        right: '0px',
        marginRight: '8px',
        marginBottom: '8px',
        outline: 'outset',
        display: 'none',
        zIndex: "99999998",
        cursor: "pointer",
    }
    
    const stopStyles = {
        width: '48px',
        height: '48px',
        backgroundColor: 'darkred',
        color: 'red',
        position: 'fixed',
        borderRadius: '50%',
        bottom: '0px',
        right: '72px',
        marginRight: '8px',
        marginBottom: '8px',
        outline: 'outset',
        zIndex: "99999999",
        cursor: "pointer",
    }

    const fileStyles = {
        position: "fixed",
        bottom: "142px",
        right: "-156px",
        color: "transparent",
        zIndex: "99999999",
        cursor: "pointer",
    };

    const playButton = document.createElement('div');
    const pauseButton = document.createElement('div');
    const stopButton = document.createElement('div');
    const livro = document.createElement('div');
    const de = document.createElement('select');
    const ate = document.createElement('select');
    const fileField = document.createElement('input');

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
    const playButtonElement = document.getElementById(playButton.id);

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
    const pauseButtonElement = document.getElementById(pauseButton.id);

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

    livro.id = livroId;
    Object.assign(livro.style, livroStyles);
    document.body.appendChild(stopButton);

    de.id = deId;
    de.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("from")}</option>`;
    de.classList.add("leitorPDF");
    Object.assign(de.style, deStyles);
    
    ate.id = ateId;
    ate.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("to")}</option>`;
    ate.classList.add("leitorPDF");
    Object.assign(ate.style, ateStyles);

    livro.appendChild(de);
    livro.appendChild(ate);

    document.body.appendChild(livro);

    fileField.id = fileFieldId;
    fileField.type = "file";
    fileField.accept = "application/pdf";
    fileField.innerHTML = `<label for="${fileFieldId}"></label>`;

    Object.assign(fileField.style, fileStyles);

    if(!window.location.href.startsWith("file:")) {
        fileField.style.display = "none";
    }
    
    document.body.appendChild(fileField);
    
    playButtonElement.addEventListener('click', (event)=>{
        playButtonElement.style.display = 'none';
        pauseButtonElement.style.display = 'block';
        if(window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return;
        }
        const deElement = document.getElementById(deId);
        const ateElement = document.getElementById(ateId);
        lerPDF(window.location.href, deElement.value, ateElement.value);
    });
    playButtonElement.addEventListener('speakEnded', (event)=>{
        pauseButtonElement.style.display = 'none';
        playButtonElement.style.display = 'block';
    });
    pauseButtonElement.addEventListener('click', (event)=>{
        pauseButtonElement.style.display = 'none';
        playButtonElement.style.display = 'block';
        window.speechSynthesis.pause();
    });
    document.getElementById(stopButtonId).addEventListener('click', (event)=>{
        pauseButtonElement.style.display = 'none';
        playButtonElement.style.display = 'block';
        cancelSpeak();
    });
    de.addEventListener('change', ()=>{
        if(parseInt(de.value) > parseInt(ate.value)) {
            ate.value = de.value;
        }
    });
    ate.addEventListener('change', ()=>{
        if(parseInt(ate.value) < parseInt(de.value)) {
            de.value = ate.value;
        }
    });
    document.getElementById(fileFieldId).addEventListener('change', async (event) => {
const input = document.getElementById(fileFieldId);
    let file = input.files[0];
    let fileBytes;
    if(window.location.protocol == 'file:' && file && !decodeURI(window.location.href).endsWith(file.name)) {
        alert("Para uma boa leitura, lembre-se de selecionar o mesmo .pdf que está aberto no navegador.");
    }
    try {
        if(window.location.protocol == 'file:') {
            fileBytes = await file.arrayBuffer();
        }
        // Fetch a PDF from the web or load it from the file system
        const buffer = window.location.protocol != 'file:' ? await fetch(url)
            .then(res => res.arrayBuffer()) : fileBytes;
        
        if(!buffer) {
            return;
        }
        const pdf = await getDocumentProxy(new Uint8Array(buffer));

        mergePages = false;
        const { totalPages, text } = await extractText(pdf, {mergePages});
        listarPaginas(totalPages);
    } catch (e) {
        alert("Primeiro selecione o .pdf no campo 'Escolher arquivo'.");
        document.getElementById(playButtonId).style.display = "block";
        document.getElementById(pauseButtonId).style.display = "none";

        return;
    }
    });
}
export { playButtonId, speakEndedEvent }