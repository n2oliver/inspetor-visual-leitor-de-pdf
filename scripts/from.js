import { toId } from "./to";

const fromId = "de";
function from() {
    const from = document.createElement('select');
    const fromStyles = {
        position: "absolute",
        left: "8px",
        top: "10px",
        width: "40px",
        height: "40px",
        textAlign: "center",
        zIndex: "99999999",
        cursor: "pointer",
    }

    from.id = fromId;
    from.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("from")}</option>`;
    from.classList.add("leitorPDF");

    Object.assign(from.style, fromStyles);
    
    from.addEventListener('change', () => {
        const to = document.getElementById(toId);
        if (parseInt(from.value) > parseInt(to.value)) {
            to.value = from.value;
        }
    });

    return from;
}
export { from, fromId };