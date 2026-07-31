const abreviacoes = [
    [/\u0000/g, ""],
    [/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""],
    [/[ \t]+/g, ""],
    [/\r\n/g, "\n"],
    [/\—/gi, '\n '],
    [/\*/gi, ' '],
    [/-\n/gi, ''],
    [/\n/gi, ' '],
    [/•/gi, "; "],
    [/\b\:/gi, ". "],
    [/\b\./gi, "\n"],
];
export { abreviacoes };