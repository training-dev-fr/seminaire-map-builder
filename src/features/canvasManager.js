import config from "../core/config.js";
import { floodFillCells, setCell, syncMapJson } from "../state/mapData.js";

function getCanvasDimensions(context) {
    return {
        width: context.canvas.width,
        height: context.canvas.height,
    };
}

export function resizeCanvas(canvas, size) {
    const cellSize = Math.floor(
        Math.min(
            config.maxCanvasWidth / size.width,
            config.maxCanvasHeight / size.height,
        ),
    );

    canvas.width = cellSize * size.width;
    canvas.height = cellSize * size.height;
}

export function clearCanvas(context) {
    const { width, height } = getCanvasDimensions(context);

    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
}

export function drawGrid(context, size) {
    const canvasSize = getCanvasDimensions(context);
    const { width, height } = size;
    const squareWidth = canvasSize.width / width;
    const squareHeight = canvasSize.height / height;

    clearCanvas(context);

    context.strokeStyle = "#6080F0";
    context.beginPath();

    for (let x = 1; x < width; x += 1) {
        context.moveTo(x * squareWidth, 0);
        context.lineTo(x * squareWidth, canvasSize.height);
    }

    for (let y = 1; y < height; y += 1) {
        context.moveTo(0, y * squareHeight);
        context.lineTo(canvasSize.width, y * squareHeight);
    }

    context.stroke();
    context.closePath();
}

export function getCellFromEvent(event, size) {
    const canvas = event.currentTarget;
    const squareWidth = canvas.width / size.width;
    const squareHeight = canvas.height / size.height;

    return {
        x: Math.floor(event.offsetX / squareWidth),
        y: Math.floor(event.offsetY / squareHeight),
    };
}

export function drawTile(context, tileSet, size, x, y, tileObject) {
    drawTileWithOptions(context, tileSet, size, x, y, tileObject);
}

export function drawTileWithOptions(context, tileSet, size, x, y, tileObject, options = {}) {
    if (!tileSet || !tileObject) return;

    let tileIndex = typeof tileObject === 'number' ? tileObject : tileObject.index;
    let rotation = typeof tileObject === 'number' ? 0 : tileObject.rotation || 0;

    if (tileSet.listItem[tileIndex] === undefined) {
        return;
    }

    const { gap = 1 } = options;
    const canvasSize = getCanvasDimensions(context);
    const cellWidth = canvasSize.width / size.width;
    const cellHeight = canvasSize.height / size.height;
    const squareWidth = cellWidth - gap;
    const squareHeight = cellHeight - gap;
    const offsetX = x * cellWidth;
    const offsetY = y * cellHeight;

    const tileImage = tileSet.listItem[tileIndex];

    if (rotation !== 0) {
        // Sauvegarde le contexte actuel
        context.save();
        
        // Déplace le point d'origine au centre de la tuile
        const centerX = offsetX + squareWidth / 2;
        const centerY = offsetY + squareHeight / 2;
        context.translate(centerX, centerY);
        
        // Rotation (conversion de degrés en radians)
        context.rotate((rotation * Math.PI) / 180);
        
        // Dessine la tuile centrée sur 0,0
        context.drawImage(
            tileImage,
            -squareWidth / 2,
            -squareHeight / 2,
            squareWidth,
            squareHeight
        );
        
        // Restaure le contexte pour ne pas affecter les autres dessins
        context.restore();
    } else {
        context.drawImage(
            tileImage,
            offsetX,
            offsetY,
            squareWidth,
            squareHeight,
        );
    }
}

export function eraseTile(context, size, x, y) {
    const canvasSize = getCanvasDimensions(context);
    const cellWidth = canvasSize.width / size.width;
    const cellHeight = canvasSize.height / size.height;
    const squareWidth = cellWidth - 1;
    const squareHeight = cellHeight - 1;

    context.fillStyle = "#000000";
    context.fillRect(
        x * cellWidth,
        y * cellHeight,
        squareWidth,
        squareHeight,
    );
}

export function applyTool(context, state, position) {
    const { currentTool, currentTile, currentRotation, currentSize, baseField } = state;

    if (currentTile === null && currentTool !== "erase") return;

    // Construit l'objet tuile avec index et rotation
    const tileObject = { index: currentTile, rotation: currentRotation };

    switch (currentTool) {
        case "fill": {
            const updatedCells = floodFillCells(state.mapData, position.x, position.y, tileObject);

            updatedCells.forEach((cell) => {
                drawTileWithOptions(context, baseField, currentSize, cell.x, cell.y, tileObject);
            });

            syncMapJson(state);
            return;
        }
        case "erase":
            eraseTile(context, currentSize, position.x, position.y);
            setCell(state.mapData, position.x, position.y, null);
            syncMapJson(state);
            return;
        case "pen":
        default:
            drawTileWithOptions(context, baseField, currentSize, position.x, position.y, tileObject);
            setCell(state.mapData, position.x, position.y, tileObject);
            syncMapJson(state);
    }
}

export function renderMap(context, state, options = {}) {
    const { showGrid = true } = options;

    if (showGrid) {
        drawGrid(context, state.currentSize);
    } else {
        clearCanvas(context);
    }

    state.mapData.cells.forEach((row, y) => {
        row.forEach((tileObject, x) => {
            if (tileObject === null) {
                return;
            }

            drawTileWithOptions(
                context,
                state.baseField,
                state.currentSize,
                x,
                y,
                tileObject,
                { gap: showGrid ? 1 : 0 },
            );
        });
    });
}