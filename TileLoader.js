export default function loadTileButton(tileList){
    let container = document.querySelector(".tuile");
    let content = '';
    for(let [key,value] of Object.entries(tileList.listItem)){
        content += `<button data-id="${key}"><canvas width="50" height="50"></canvas></button>`
    }
    container.innerHTML = content;
    let canvasList = container.querySelectorAll("canvas");
    let i = 0;
    for(let canvas of canvasList){
        let ctx = canvas.getContext("2d");
        ctx.drawImage(tileList.listItem[i++],0,0);
    }
}