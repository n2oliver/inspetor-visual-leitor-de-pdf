async function checkInspVisual() {
    const result = await chrome.storage.local.get(["insp_visual_ligado"]);
    document.getElementById("insp_visual_ligado").checked = result.insp_visual_ligado;
    
    if (result.insp_visual_ligado == true) {
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("tooltip");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualLigado");
    } else {
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("labelForInspVisualDesligado");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualDesligado");
    }
}
async function updateUI() {
    document.getElementById("tooltip").textContent =
        chrome.i18n.getMessage("tooltip");

    document.querySelector('[for="insp_visual_ligado"]').textContent =
        chrome.i18n.getMessage("labelForInspVisualLigado");

    document.getElementById("btn-info").title =
        chrome.i18n.getMessage("btnInfo");

    document.getElementById("info").innerHTML =
        chrome.i18n.getMessage("info");

    await checkInspVisual();
}
async function checkSpeaker() {
    const vozResult = await chrome.storage.local.get(["voz"]);
    const selectVozes = document.getElementById("vozes");
    if ('speechSynthesis' in window) {
        window.speechSynthesis.addEventListener("voiceschanged", () => {
            const vozes = speechSynthesis.getVoices();
            for (let i in vozes) {
                const option = document.createElement('option');
                option.innerText = vozes[i].name;
                option.value = i;
                if (vozResult.voz == i) {
                    option.selected = true;
                }
                selectVozes.appendChild(option);
            }
            selectVozes.onchange = async () => {
                await chrome.storage.local.set({ voz: selectVozes.selectedIndex });
            }
        });
    }
}
async function changeState() {
    const result = await chrome.storage.local.get(["insp_visual_ligado"]);

    if (result.insp_visual_ligado == true) {
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("tooltipForInspVisualDesligado");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualDesligado");
        chrome.runtime.sendMessage({ action: "ocultarPeloLeitor", dados: { targetElementId: "insp_visual_ligado" } });
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    } else {
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("tooltip");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualLigado");
        chrome.runtime.sendMessage({ action: "reexibir", dados: { targetElementId: "insp_visual_ligado" } });
    }

    await chrome.storage.local.set({ insp_visual_ligado: !result.insp_visual_ligado });
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    checkSpeaker();
    document.getElementById("insp_visual_ligado").onclick = changeState;
    document.getElementById("btn-info").addEventListener("click", () => {
        const info = document.getElementById("info");
        if (info.style.display == 'none') {
            info.style.display = 'block';
        } else {
            info.style.display = 'none';
        }
    });
    document.getElementById("n2oliver-link").addEventListener("click", () => window.open('https://n2oliver.com'));
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action == "ocultar") {
        await changeState();
        const result = await chrome.storage.local.get(["insp_visual_ligado"]);
        document.getElementById("insp_visual_ligado").checked = result.insp_visual_ligado;
    }

    return true;
});