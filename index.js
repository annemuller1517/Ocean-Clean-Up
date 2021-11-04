let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


// canvas.width = max.width
// canvas.heigth = max.height

let startBtn = document.querySelector('#start')
let restartBtn = document.querySelector('#restart')
let instrucionsBtn = document.querySelector('#instructions')
let startNow = document.getElementById("startNow")
let instructions = document.querySelector(".instructionPage")
let intro = document.querySelector(".startPage")
let won = document.querySelector(".wonPage")
let first = document.getElementById('firstPlace')
let second = document.getElementById('secondPlace')
let third = document.getElementById('thirdPlace')

// load all images
let bg = new Image();
bg.src = "./images/oceanBackground.png";

let gameOverBg = new Image();
gameOverBg.src = "./Images/ocean.jpg"

let fish = new Image();
fish.src = './images/fish.png';

let bin = new Image();
bin.src = './images/scubaguy.png'


let scubaLeft = new Image();
scubaLeft.src = "./Images/Screenshot_2021-11-03_at_16.49.11-removebg-preview.png"


let plastic = new Image();
plastic.src = './images/plasticBottle.png'


let backgroundMusic = new Audio('./sounds/disney_instrumental_neverland_orchestra_under_the_sea_TZsy_XIByoK-gucZwiP_.mp3')
let plasticSound = new Audio("./sounds/Plastic-sound.mp3")
let fishSound = new Audio("./sounds/mixkit-ow-exclamation-of-pain-2204.wav")


let intervalId = 0;
let isGameOver = false;
//make global variable so you can change it at some point. 
let fishX = 0, fishY = 0;
let binX = 60, binY = 60;
bin.width = 80, bin.height = 80;
plastic.width = 60, plastic.height = 60;
let plasticY = 0, plasticX = 0;
let isRight = false, isLeft = false, isUp = false, isDown = false;

let score = 0;
let fishArr = []
let plasticArr = []

let fishSpeed = 2
let lives = 3



function fishArray() {
    let extra = 0
    for(i=0; i<20; i++) {
        fishArr.push({x: Math.random()*(canvas.width) + 100 + extra, y: Math.random()*(canvas.height) - 40})
        extra += 50
    }
}

function plasticArray() {
    for(i=0; i<16; i++) {
        plasticArr.push({x: Math.random()*(canvas.width) + 40 + plastic.height , y: Math.random()*(canvas.height) - plastic.width})
        
    }
}


function startScreen() {
    canvas.style.display = "none"
    startBtn.style.display = "block"
    backgroundMusic.play()
    intro.style.display = "block"   
}



function showInstructions() {
    intro.style.display = "none" 
    instructions.style.display = "block"
}


function calculateHighscores() {
    if (score > first.innerText) {
        second.innerText = first.innerText
        first.innerText = score
    }
    else if (score > second.innerText) {
        third.innerText = second.innerText
        second.innerText = score
    }
    else if (score > third.innerText) {
        third.innerText = score
    }
}

function showGameOver() {
    ctx.drawImage(bg, 0,0, 1500, 800)
    backgroundMusic.pause()
    canvas.style.display = 'none';
    restartBtn.style.display = 'block';
    won.style.display = 'block';
    startBtn.style.display = 'none';
    calculateHighscores()
    binY = 40;
    binX = 40;
    isGameOver = false;
    plasticArr = []
    fishArr = []
    score = 0
    fishSpeed = 2
    lives = 3

}



// basic animation template
function draw(){
    // canvas setup
    intro.style.display = "none";
    canvas.style.display = 'block';
    won.style.display = "none";
    instructions.style.display = "none"

    // background image 
    ctx.drawImage(bg, 0,0, 1500, 800)

    // ctx.drawImage(bin, binX, binY, bin.width, bin.height)
    
    // bin image 
    if (isRight == true || isLeft == false) {
        ctx.drawImage(bin, binX, binY, bin.width, bin.height)
    }


    else if (isLeft == true && isRight == false){
        //deleten 
        ctx.drawImage(scubaLeft, binX, binY, bin.width, bin.height)
    }
    // morgen kijken 


    
    ctx.font = '30px Verdana'
    ctx.fillStyle = 'white'
    ctx.fillText(`Score: ${score} `, 10, 40)

    ctx.font = '30px Verdana'
    ctx.fillStyle = 'white'
    ctx.fillText(`Lives: ${lives} `, canvas.width -130, 40)


    // fish images 
    for (i=0; i<fishArr.length; i++) {
        ctx.drawImage(fish, fishArr[i].x, fishArr[i].y, 40, 40)
        fishArr[i].x = fishArr[i].x - fishSpeed
        
        if (fishArr[i].x + fish.width < 0) {
            fishArr[i].x = canvas.width
            fishArr[i].y = Math.random()*(canvas.height)
        }

        // collision fish 
        if (binX + 50 >= fishArr[i].x && binX <= fishArr[i].x + 40){
            if (binY + 50 >= fishArr[i].y && binY <= fishArr[i].y + 40){
                fishSound.play()
                fishArr.splice(i, 1) 
                lives--
                
                // game is over after 3 lives 
                if (lives < 1) {
                    isGameOver = true
                }
        }
    }

    }

    // move of the bin
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
        //draw plastic 
        ctx.drawImage(plastic, plasticArr[j].x, plasticArr[j].y, 60, 60)
            
        // colliion plastic 
        if (plasticArr[j].x < binX + bin.width && plasticArr[j].x + plastic.width > binX
            && plasticArr[j].y < binY + bin.height && plasticArr[j].y + plastic.height > binY) {
            score++
            plasticSound.play()
            
            // increase speed of fish 
            if (score > 2) {
                fishSpeed = fishSpeed + 0.5
            }
            else if (score > 6) {
                fishSpeed = fishSpeed + 1
            }
            else if (score > 10) {
                fishSpeed = fishSpeed + 3
            }

            // mutates the original array. 
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


window.addEventListener('load', () => {
    canvas.style.display = 'none'
    won.style.display = 'none'
    instructions.style.display = "none"

    document.addEventListener('keydown', (event) => {
        if (event.key == 'ArrowLeft' ) {
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
        backgroundMusic.play()
        draw()
        plasticArray()
        fishArray()
    })
    
    restartBtn.addEventListener('click', () => {
        backgroundMusic.play()
        draw()
        plasticArray()
        fishArray()
    })

    instrucionsBtn.addEventListener('click', () => {
        showInstructions()
    })
    startNow.addEventListener('click', () => {
        backgroundMusic.play()
        draw()
        plasticArray()
        fishArray()
    })

})