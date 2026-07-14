async function checkLanguage() {
    document.getElementById("tooltip").textContent = chrome.i18n.getMessage("tooltip");
    document.querySelector('[for="insp_visual_ligado"]').textContent = chrome.i18n.getMessage("labelForInspVisualLigado");
    document.getElementById("btn-info").title = chrome.i18n.getMessage("btnInfo");
    document.getElementById("info").innerHTML = chrome.i18n.getMessage("info");
    changeLanguage()
}
async function changeLanguage() {
    document.getElementById("tooltip").textContent = chrome.i18n.getMessage("tooltip");
    document.querySelector('[for="insp_visual_ligado"]').textContent = chrome.i18n.getMessage("labelForInspVisualLigado");
    document.getElementById("btn-info").title = chrome.i18n.getMessage("btnInfo");
    document.getElementById("info").innerHTML = chrome.i18n.getMessage("info");
    checkInspVisual();
}
async function checkInspVisual() {
    const result = await chrome.storage.local.get(["insp_visual_ligado"]);

    if(result.insp_visual_ligado == true) {
        document.getElementById("insp_visual_ligado").checked = true;
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("tooltip");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualLigado");
    } else {
        document.getElementById("insp_visual_ligado").checked = false;
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("labelForInspVisualLigado");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualDesligado");
    }
}
async function checkSpeaker() {
    const result = await chrome.storage.local.get(["insp_visual_leitor_de_tela"]);
    const vozResult = await chrome.storage.local.get(["voz"]);
    const selectVozes = document.getElementById("vozes");
    if('speechSynthesis' in window) {
        window.speechSynthesis.addEventListener("voiceschanged", () => {
            const vozes = speechSynthesis.getVoices();
            for(let i in vozes) {
                const option = document.createElement('option');
                option.innerText = vozes[i].name;
                option.value = i;
                if(vozResult.voz == i) {
                    option.selected = true;
                }
                selectVozes.appendChild(option);
            }
            selectVozes.onchange = async () => {
                await chrome.storage.local.set({voz: selectVozes.selectedIndex });
            }
        });
    }
    if(result.insp_visual_leitor_de_tela == true) {
        document.getElementById("vozes").parentElement.classList.remove("d-none");
    } else {
        document.getElementById("vozes").parentElement.classList.add("d-none");
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }
}
async function changeState() {
    const result = await chrome.storage.local.get(["insp_visual_ligado"]);
    if(result.insp_visual_ligado == true) {
        await chrome.storage.local.set({insp_visual_ligado: false});
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("tooltipForInspVisualDesligado");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualDesligado");
    } else {
        await chrome.storage.local.set({insp_visual_ligado: true});
        document.querySelector('#tooltip').innerHTML = chrome.i18n.getMessage("tooltip");
        document.querySelector('[for="insp_visual_ligado"]').innerHTML = chrome.i18n.getMessage("labelForInspVisualLigado");
    }
}

window.onload = () => {
    checkLanguage();
    checkInspVisual();
    checkSpeaker();
    document.getElementById("insp_visual_ligado").onclick= changeState;
    document.getElementById("btn-info").addEventListener("click", () => {
        const info = document.getElementById("info");
        if(info.style.display == 'none') {
            info.style.display = 'block';
        } else {
            info.style.display = 'none';
        }
    });
    document.getElementById("n2oliver-link").addEventListener("click", () => window.open('https://n2oliver.com'));
}