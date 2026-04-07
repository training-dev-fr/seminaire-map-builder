const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

context.beginPath();
context.arc(250,250,50,0,Math.PI/2);
context.fillStyle = "#1565c0";
context.strokeStyle = "rgb(255,0,0)";
context.lineWidth = 5;
context.fill();
context.stroke();