import { applyTool, drawGrid, getCellFromEvent, renderMap, resizeCanvas } from "./features/canvasManager.js";
import { readGridSize } from "./features/sizeControls.js";
import { createAppState } from "./state/appState.js";
import { parseMapData, resizeMapData, syncMapJson } from "./state/mapData.js";
import { dom } from "./ui/dom.js";
import loadTileButton from "./tiles/tileLoader.js";
import loadTile, { loadTileFromBlob } from "./tiles/tileManager.js";

const state = createAppState();
window.mapBuilderState = state;

async function initialize() {
    state.baseField = await loadTile("tiles3.png", 5, 5);

    loadTileButton(state.baseField, dom.tileContainer, (selectedTile) => {
        state.currentTile = selectedTile;
        state.currentRotation = 0; // Réinitialise la rotation quand on change de tuile
        updateRotationUI();
    });

    bindCanvasEvents();
    bindToolButtons();
    bindSizeControls();
    bindExportButtons();
    bindImportButton();
    bindImportTilesetButton();

    dom.changeSizeButton.click();
}

function bindCanvasEvents() {
    dom.canvas.addEventListener("click", (event) => {
        const position = getCellFromEvent(event, state.currentSize);
        applyTool(dom.context, state, position);
    });
}

function bindToolButtons() {
    dom.toolButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            dom.toolButtons.forEach((toolButton) => toolButton.classList.remove("active"));
            event.currentTarget.classList.add("active");
            state.currentTool = event.currentTarget.dataset.id;
        });
    });

    dom.rotateButton.addEventListener("click", () => {
        state.currentRotation = (state.currentRotation + 90) % 360;
        updateRotationUI();
    });
}

function updateRotationUI() {
    // Fait tourner l'icône du bouton pour indiquer la rotation actuelle
    const icon = dom.rotateButton.querySelector('i');
    if (icon) {
        icon.style.transform = `rotate(${state.currentRotation}deg)`;
        icon.style.transition = 'transform 0.2s';
    }
}

function bindSizeControls() {
    dom.changeSizeButton.addEventListener("click", () => {
        state.currentSize = readGridSize(dom.widthInput, dom.heightInput);
        state.mapData = resizeMapData(state.currentSize.width, state.currentSize.height);
        syncMapJson(state);
        resizeCanvas(dom.canvas, state.currentSize);
        drawGrid(dom.context, state.currentSize);
    });
}

function bindExportButtons() {
    dom.exportJsonButton.addEventListener("click", () => {
        const fileContent = new Blob([state.mapJson], { type: "application/json" });
        const downloadUrl = URL.createObjectURL(fileContent);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "map.json";
        link.click();

        URL.revokeObjectURL(downloadUrl);
    });

    dom.exportImageButton.addEventListener("click", () => {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = dom.canvas.width;
        exportCanvas.height = dom.canvas.height;

        const exportContext = exportCanvas.getContext("2d");
        renderMap(exportContext, state, { showGrid: false });

        const link = document.createElement("a");
        link.href = exportCanvas.toDataURL("image/png");
        link.download = "map.png";
        link.click();
    });
}

function bindImportButton() {
    dom.importJsonButton.addEventListener("click", () => {
        dom.importJsonFileInput.click();
    });

    dom.importJsonFileInput.addEventListener("change", async (event) => {
        const [file] = event.currentTarget.files;

        if (!file) {
            return;
        }

        try {
            const fileContent = await file.text();
            const importedMapData = parseMapData(fileContent);

            state.mapData = importedMapData;
            state.currentSize = {
                width: importedMapData.width,
                height: importedMapData.height,
            };

            dom.widthInput.value = importedMapData.width;
            dom.heightInput.value = importedMapData.height;

            syncMapJson(state);
            resizeCanvas(dom.canvas, state.currentSize);
            renderMap(dom.context, state);
        } catch (error) {
            window.alert(error.message);
        } finally {
            event.currentTarget.value = "";
        }
    });
}

function bindImportTilesetButton() {
    dom.importTilesetButton.addEventListener("click", () => {
        dom.importTilesetFileInput.click();
    });

    dom.importTilesetFileInput.addEventListener("change", async (event) => {
        const [file] = event.currentTarget.files;
        if (!file) return;

        try {
            const tileWidth = parseInt(dom.tileWidthInput.value, 10) || 16;
            const tileHeight = parseInt(dom.tileHeightInput.value, 10) || 16;
            
            const newTileSet = await loadTileFromBlob(file, tileWidth, tileHeight);
            state.baseField = newTileSet;
            
            loadTileButton(state.baseField, dom.tileContainer, (selectedTile) => {
                state.currentTile = selectedTile;
                state.currentRotation = 0;
                updateRotationUI();
            });
            
            // Redraw map with new tiles
            renderMap(dom.context, state);
        } catch (error) {
            window.alert("Erreur lors de l'import du tileset : " + error.message);
        } finally {
            event.currentTarget.value = "";
        }
    });
}

initialize();