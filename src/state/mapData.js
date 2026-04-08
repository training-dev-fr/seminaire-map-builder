export function createEmptyMapData(width, height) {
    return {
        width,
        height,
        cells: Array.from({ length: height }, () => Array(width).fill(null)),
    };
}

export function resizeMapData(width, height) {
    return createEmptyMapData(width, height);
}

export function getCell(mapData, x, y) {
    if (!mapData.cells[y] || mapData.cells[y][x] === undefined) {
        return undefined;
    }

    return mapData.cells[y][x];
}

export function setCell(mapData, x, y, value) {
    if (!mapData.cells[y] || mapData.cells[y][x] === undefined) {
        return;
    }

    mapData.cells[y][x] = value;
}

function isSameTile(cell1, cell2) {
    if (cell1 === null && cell2 === null) return true;
    if (cell1 === null || cell2 === null) return false;
    if (typeof cell1 === 'number' && typeof cell2 === 'number') return cell1 === cell2;
    return cell1.index === cell2.index && cell1.rotation === cell2.rotation;
}

export function floodFillCells(mapData, startX, startY, nextValue) {
    const targetValue = getCell(mapData, startX, startY);

    if (isSameTile(targetValue, nextValue)) {
        return [];
    }

    const pendingCells = [{ x: startX, y: startY }];
    const updatedCells = [];
    const visitedCells = new Set();

    while (pendingCells.length > 0) {
        const cell = pendingCells.pop();
        const cellKey = `${cell.x}:${cell.y}`;

        if (visitedCells.has(cellKey)) {
            continue;
        }

        visitedCells.add(cellKey);

        if (!isSameTile(getCell(mapData, cell.x, cell.y), targetValue)) {
            continue;
        }

        setCell(mapData, cell.x, cell.y, nextValue);
        updatedCells.push(cell);

        pendingCells.push({ x: cell.x + 1, y: cell.y });
        pendingCells.push({ x: cell.x - 1, y: cell.y });
        pendingCells.push({ x: cell.x, y: cell.y + 1 });
        pendingCells.push({ x: cell.x, y: cell.y - 1 });
    }

    return updatedCells;
}

export function serializeMapData(mapData) {
    return JSON.stringify(mapData, null, 2);
}

export function syncMapJson(state) {
    state.mapJson = serializeMapData(state.mapData);
}

export function parseMapData(jsonContent) {
    const parsedMap = JSON.parse(jsonContent);

    if (!Number.isInteger(parsedMap.width) || parsedMap.width <= 0) {
        throw new Error("Largeur invalide dans le JSON.");
    }

    if (!Number.isInteger(parsedMap.height) || parsedMap.height <= 0) {
        throw new Error("Hauteur invalide dans le JSON.");
    }

    if (!Array.isArray(parsedMap.cells) || parsedMap.cells.length !== parsedMap.height) {
        throw new Error("Structure de cellules invalide dans le JSON.");
    }

    parsedMap.cells.forEach((row) => {
        if (!Array.isArray(row) || row.length !== parsedMap.width) {
            throw new Error("Les lignes du JSON ne correspondent pas a la taille indiquee.");
        }

        for (let i = 0; i < row.length; i++) {
            const cell = row[i];
            if (cell !== null) {
                if (typeof cell === 'number') {
                    row[i] = { index: cell, rotation: 0 };
                } else if (typeof cell === 'object' && 'index' in cell && 'rotation' in cell) {
                } else {
                    throw new Error("Format de cellule non reconnu.");
                }
            }
        }
    });

    return {
        width: parsedMap.width,
        height: parsedMap.height,
        cells: parsedMap.cells.map((row) => [...row]),
    };
}