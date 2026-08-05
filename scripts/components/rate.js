import { pitch, utterance } from "./speaker";

const velocidadeId = "velocidade";
function rate() {
    const velocidade = document.createElement('input');
    const velocidadeStyle = {
        width: "112px",
        position: "fixed",
        bottom: "4px",
        right: "12px",
        color: "black",
        zIndex: "99999999",
        cursor: "pointer",
    }
    velocidade.id = velocidadeId;
    velocidade.type = "range";
    velocidade.name = velocidadeId;
    velocidade.min = 25;
    velocidade.max = 200;
    velocidade.value = 100;
    velocidade.step = 10;
    Object.assign(velocidade.style, velocidadeStyle);
    document.body.appendChild(velocidade);
    document.getElementById(velocidadeId).addEventListener("change", (event) => {
        if ('speechSynthesis' in window) {
            utterance.rate = 1.5 * (parseInt(event.target.value) / 100);
            utterance.pitch = pitch(utterance.rate);
        }
    })
}
export { rate, velocidadeId };