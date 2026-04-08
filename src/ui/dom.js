const canvas = document.querySelector("canvas");

export const dom = {
    canvas,
    context: canvas.getContext("2d"),
    tileContainer: document.querySelector(".tuile"),
    toolButtons: document.querySelectorAll(".tools button[data-id='pen'], .tools button[data-id='fill'], .tools button[data-id='erase']"),
    rotateButton: document.querySelector(".tools button[data-id='rotate']"),
    widthInput: document.querySelector("#width"),
    heightInput: document.querySelector("#height"),
    changeSizeButton: document.querySelector("#change-size"),
    exportJsonButton: document.querySelector("#export-json"),
    exportImageButton: document.querySelector("#export-image"),
    importJsonButton: document.querySelector("#import-json"),
    importJsonFileInput: document.querySelector("#import-json-file"),
    importTilesetButton: document.querySelector("#import-tileset"),
    importTilesetFileInput: document.querySelector("#import-tileset-file"),
    tileWidthInput: document.querySelector("#tile-width"),
    tileHeightInput: document.querySelector("#tile-height"),
};
