let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


let startBtn = document.querySelector('#start')
let restartBtn = document.querySelector('#restart')
let intro = document.querySelector(".startPage")
let won = document.querySelector(".wonPage")

// load all images
let bg = new Image();
bg.src = "./images/oceanBackground.png";

let fish = new Image();
fish.src = './images/fish.png';

let bin = new Image();
bin.src = './images/bin.png'

let plastic = new Image();
plastic.src = './images/plastic.png'

let intervalId = 0;
let isGameOver = false;
//make global variable so you can change it at some point. 
let fishX = 0, fishY = 0;
let binX = 60, binY = 60;
bin.width = 110, bin.height = 110;
plastic.width = 60, plastic.height = 60;
let plasticY = 0, platicX = 0;
let isRight = false, isLeft = false, isUp = false, isDown = false;

let score = 0;


let fishArr = [
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
    {x: Math.random()*(canvas.width), y: Math.random()*(canvas.height)},
]


let plasticArr = [
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
    {x: Math.random()*(canvas.width) + plastic.height, y: Math.random()*(canvas.height) - plastic.width},
]



function showGameOver() {
    canvas.style.display = 'none';
    restartBtn.style.display = 'block';
    won.style.display = 'block';
    startBtn.style.display = 'none';
}



// basic animation template
function draw(){
    // background image 
    ctx.drawImage(bg, 0,0)
    
    // bin image 
    ctx.drawImage(bin, binX, binY, bin.width, bin.height)


    ctx.font = '24px Verdana'
    ctx.fillStyle = 'white'
    ctx.fillText(`Score: ${score} `, 10, 20)


    // fish images 
    for (i=0; i<fishArr.length; i++) {
        ctx.drawImage(fish, fishArr[i].x, fishArr[i].y, 40, 40)
        fishArr[i].x = fishArr[i].x - 2
        
        if (fishArr[i].x + fish.width < 0) {
            fishArr[i].x = canvas.width
            fishArr[i].y = Math.random()*(canvas.height)
        }

    }

    if (isRight && binX + bin.width < canvas.width) {
        binX = binX + 5
    }
    if (isLeft && binX > 0) {
        binX = binX - 5
    }

    if (isDown && binY + bin.width < canvas.height) {
        binY = binY + 5
    }
    if (isUp && binY > 0) {
        binY = binY - 5
    }


    for (j=0; j<plasticArr.length; j++){
        ctx.drawImage(plastic, plasticArr[j].x, plasticArr[j].y, 60, 60)

        if (plasticArr[j].x < binX + bin.width && plasticArr[j].x + plastic.width > binX
            && plasticArr[j].y < binY + bin.height && plasticArr[j].y + plastic.height > binY) {
            score++
            plasticArr.splice(j, 1) 
            if (plasticArr.length == 0) {
                isGameOver = true
            }
    }
    
   
}

    if (isGameOver) {
        cancelAnimationFrame(intervalId)
        showGameOver()

    }
    else {
        intervalId = requestAnimationFrame(draw)
    }
    
}


function handleStart(){
    // hide intro and won page 
    intro.style.display = "none";
    canvas.style.display = 'block';
    won.style.display = "none"

    
}





window.addEventListener('load', () => {
    canvas.style.display = 'none'
    won.style.display = 'none'
    draw()

    document.addEventListener('keydown', (event) => {
        if (event.key == 'ArrowLeft') {
            isLeft = true;
            isRight = false;
            isUp = false; 
            isDown = false; 
        }
        if (event.key == 'ArrowRight') {
            isRight = true;
            isLeft = false;
            isUp = false;
            isDown = false;
        }
        if (event.key == 'ArrowUp') {
            isLeft = false;
            isRight = false;
            isUp = true; 
            isDown = false; 
        }
        if (event.key == 'ArrowDown') {
            isLeft = false;
            isRight = false;
            isUp = false; 
            isDown = true; 
        }
    })

    document.addEventListener('keyup', () => {
        isLeft = false;
        isRight = false;
        isUp = false;
        isDown = false;
    })


    startBtn.addEventListener('click', () => {
        handleStart()
    })



    restartBtn.addEventListener('click', () => {
        // Reset your variables here.
        gameOver = false;
        score = 0;
        draw()
        handleStart()
    })

})
