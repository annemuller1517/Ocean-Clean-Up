let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// load all the images 

let fish = new Image();
fish.src = 'https://www.freepik.com/vectors/background';


function draw(){
    ctx.drawImage(fish, 30,30)
}