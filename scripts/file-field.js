import { pauseButtonId } from "./pause-button";
import { playButtonId } from "./play-button";

const fileFieldId = "file-field";
function fileField() {
    const fileField = document.createElement('input');
    const fileStyles = {
        position: "fixed",
        bottom: "166px",
        right: "-156px",
        color: "transparent",
        zIndex: "99999999",
        cursor: "pointer",
    };
    fileField.id = fileFieldId;
    fileField.type = "file";
    fileField.accept = "application/pdf";
    fileField.innerHTML = `<label for="${fileFieldId}"></label>`;
    Object.assign(fileField.style, fileStyles);

    if (!window.location.href.startsWith("file:")) {
        fileField.style.display = "none";
    }
    document.body.appendChild(fileField);
    document.getElementById(fileFieldId).addEventListener('change', async (event) => {
        const input = document.getElementById(fileFieldId);
        let file = input.files[0];
        let fileBytes;
        if (window.location.protocol == 'file:' && file && !decodeURI(window.location.href).endsWith(file.name)) {
            alert("Para uma boa leitura, lembre-se from selecionar o mesmo .pdf que está aberto no navegador.");
        }
        try {
            if (window.location.protocol == 'file:') {
                fileBytes = await file.arrayBuffer();
            }
            // Fetch a PDF from the web or load it from the file system
            const buffer = window.location.protocol != 'file:' ? await fetch(url)
                .then(res => res.arrayBuffer()) : fileBytes;

            if (!buffer) {
                return;
            }
            const pdf = await getDocumentProxy(new Uint8Array(buffer));

            mergePages = false;
            const { totalPages, text } = await extractText(pdf, { mergePages });
            listarPaginas(totalPages);
        } catch (e) {
            alert("Primeiro selecione o .pdf no campo 'Escolher arquivo'.");
            document.getElementById(playButtonId).style.display = "block";
            document.getElementById(pauseButtonId).style.display = "none";

            return;
        }
    });
}
export { fileField, fileFieldId };