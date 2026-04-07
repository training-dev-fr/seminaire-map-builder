const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

context.fillStyle = "rgba(255,0,0)";
context.fillRect(50,50,100,100);

context.fillStyle = "rgba(0,0,255,0.5)";
context.fillRect(75,75,100,100);