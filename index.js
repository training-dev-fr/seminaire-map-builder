import config from "./config.js";
import loadTile from "./TileManager.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

context.fillStyle= "#ff0000";
context.fillRect(0,0,500,500);

async function loadImage(){
    const baseField = await loadTile("tilegrasssand.png",5,1);
    const squareWidth = (config.canvasWidth / config.width) - 1;
    const squareHeight = (config.canvasHeight / config.height) - 1;
    for(let x=0; x<= config.width -1;x++){
        for(let y=0; y<= config.height-1;y++){
            context.drawImage(baseField.listItem[(Math.floor(Math.random()*5))], (x * squareWidth) + x,(y * squareHeight) +y,squareWidth,squareHeight);
        }
    }
    
}

loadImage();