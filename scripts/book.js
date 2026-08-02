const bookId = "livro";
function book(from, to) {
    const livro = document.createElement('div');
    const livroStyles = {
        width: "108px",
        height: "66px",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 108 66'%3E%3Cpath d='M2 6 Q28 1 54 9 Q80 1 106 6 V58 Q80 53 54 64 Q28 53 2 58 Z' fill='white' stroke='%23666' stroke-width='1.5'/%3E%3Cline x1='54' y1='9' x2='54' y2='64' stroke='%23666' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        position: "fixed",
        bottom: "92px",
        right: "8px",
        zIndex: "99999998",
    };

    Object.assign(livro.style, livroStyles);
    
    livro.id = bookId;

    document.body.appendChild(livro);

    livro.appendChild(from);
    livro.appendChild(to);
}
export { book, bookId };