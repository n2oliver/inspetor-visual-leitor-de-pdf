import { fromId } from "./from";

const toId = "to";
function to() {
    const to = document.createElement('select');
    const toStyles = {
        position: "absolute",
        left: "60px",
        top: "10px",
        width: "40px",
        height: "40px",
        textAlign: "center",
        zIndex: "99999999",
        cursor: "pointer",
    }
    
    to.id = toId;
    to.innerHTML = `<option selected disabled value="">${chrome.i18n.getMessage("to")}</option>`;
    to.classList.add("leitorPDF");

    Object.assign(to.style, toStyles);
    to.addEventListener('change', () => {
        const from = document.getElementById(fromId);
        if (parseInt(to.value) < parseInt(from.value)) {
            from.value = to.value;
        }
    });

    return to;
}
export { to, toId };