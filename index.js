import config from "./config.js";
import loadTileButton from "./TileLoader.js";
import loadTile from "./TileManager.js";

let currentTuile = null;
let baseField = null;
let currentSize = {
    width: 10,
    height: 10
}
let currentTool = "pen";

const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

context.fillStyle = "#ff0000";
context.fillRect(0, 0, 500, 500);

async function loadImage() {
    baseField = await loadTile("tilegrasssand.png", 5, 1);
    loadTileButton(baseField);

    document.querySelectorAll(".tuile button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentTuile = e.currentTarget.dataset.id;
            console.log(currentTuile)
        })
    });
    document.querySelector("#change-size").click();
}

loadImage();

canvas.addEventListener("click", (e) => {
    const squareWidth = (config.canvasWidth / currentSize.width);
    const squareHeight = (config.canvasHeight / currentSize.height);
    let x = Math.floor(e.offsetX / squareWidth);
    let y = Math.floor(e.offsetY / squareHeight);
    switch (currentTool) {
        case "pen":
            drawSquare(x, y, currentTuile)
            break;
        case "fill":
            for(let x=0;x<currentSize.width;x++){
                for(let y=0;y<currentSize.height;y++){
                    drawSquare(x, y, currentTuile)
                }
            }
            break;
        case "erase":
            drawSquare(x, y, 0);
            break;
    }

});

function drawSquare(x, y, tuile) {
    const squareWidth = (config.canvasWidth / currentSize.width - 1);
    const squareHeight = (config.canvasHeight / currentSize.height - 1);
    context.drawImage(baseField.listItem[tuile], (x * squareWidth) + x, (y * squareHeight) + y, squareWidth, squareHeight);
}



document.querySelector("#change-size").addEventListener("click", () => {
    let width = document.querySelector("#width").value;
    let height = document.querySelector("#height").value;
    currentSize.width = width;
    currentSize.height = height;
    const squareWidth = (config.canvasWidth / width);
    const squareHeight = (config.canvasHeight / height);
    context.fillStyle = "#F0F0F0";
    context.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
    context.fill();
    context.strokeStyle = '#6080F0';
    context.beginPath();
    for (let x = 1; x < width; x++) {
        context.moveTo(x * squareWidth, 0);

        context.lineTo(x * squareWidth, config.canvasHeight);
        context.stroke();
    }
    for (let y = 1; y < height; y++) {
        context.moveTo(0, y * squareHeight);
        context.lineTo(config.canvasWidth, y * squareHeight);
        context.stroke();
    }
    context.closePath();
})

document.querySelectorAll('.tools button').forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll('.tools button').forEach(btn => btn.classList.remove("active"));
        e.currentTarget.classList.add('active');
        currentTool = e.currentTarget.dataset.id;
    });
})