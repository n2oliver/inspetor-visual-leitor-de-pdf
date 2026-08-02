import { extractText, getDocumentProxy } from "unpdf";
import { speak } from "./speaker.js";
import { buildLeitorDePDF } from "./builder.js";
import { fileFieldId } from "./file-field.js";
import { playButtonId } from "./play-button.js";
import { pauseButtonId } from "./pause-button.js";
import { stopButtonId } from "./stop-button.js";
import { bookId } from "./book.js";
import { fromId } from "./from.js";
import { toId } from "./to.js";

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

async function lerPDF(url, from, to) {
    const input = document.getElementById(fileFieldId);
    let file = input.files[0];
    let fileBytes;
    if(window.location.protocol == 'file:' && file && !decodeURI(window.location.href).endsWith(file.name)) {
        alert("Para uma boa leitura, lembre-se from selecionar o mesmo .pdf que está aberto no navegador.");
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
    if(ehPDF && window.location.protocol != 'file:') {
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
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    
    let pages = "";
    for(let i = 1; i <= totalPages; i++) {
        pages += `<option value="${i}">${i}</option>`
    }
    if(from) {
        from.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("from")}:</option>${ pages }`;
    }
    if(to) {
        to.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("to")}:</option>${ pages }`;
    }
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
        const from = document.getElementById(fromId);
        const to = document.getElementById(toId);

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
        if(from) {
            from.style.display = 'none';
        }
        if(to) {
            to.style.display = 'none';
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
        const livro = document.getElementById(bookId);
        const from = document.getElementById(fromId);
        const to = document.getElementById(toId);

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
        if(from) {
            from.style.display = 'block';
        }
        if(to) {
            to.style.display = 'block';
        }
    }
}

export { playButtonId, speakEndedEvent,lerPDF }