import config from "../core/config.js";
import { createEmptyMapData, serializeMapData } from "./mapData.js";

export function createAppState() {
    const mapData = createEmptyMapData(config.defaultWidth, config.defaultHeight);

    return {
        baseField: null,
        currentTile: null,
        currentRotation: 0, // Rotation de la tuile en cours en degrés (0, 90, 180, 270)
        currentTool: "pen",
        currentSize: {
            width: config.defaultWidth,
            height: config.defaultHeight,
        },
        mapData,
        mapJson: serializeMapData(mapData),
    };
}