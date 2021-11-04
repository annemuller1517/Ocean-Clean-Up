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
gameOverBg.src = "./images/ocean.jpg"

let fish = new Image();
fish.src = './images/fish.png';

let scuba = new Image();
scuba.src = './images/scubaguy.png'

let energy = new Image();
energy.src = "./images/bar.png"

let scubaLeft = new Image();
scubaLeft.src = "./images/scubaLeft.png"

let plastic = new Image();
plastic.src = './images/plasticBottle.png'


// load all the sounds
let backgroundMusic = new Audio('./sounds/disney_instrumental_neverland_orchestra_under_the_sea_TZsy_XIByoK-gucZwiP_.mp3')
let plasticSound = new Audio("./sounds/Plastic-sound.mp3")
let fishSound = new Audio("./sounds/mixkit-ow-exclamation-of-pain-2204.wav")
let gameoverSound = new Audio("./sounds/sfx-defeat2.mp3")
let eat = new Audio("./sounds/mixkit-hungry-man-eating-2252.wav")

// set volume lower 
backgroundMusic.volume = .1;
gameoverSound.volume = .2;
fishSound.volume = .2
plasticSound.volume = .2


let intervalId = 0;
let isGameOver = false;

//make global variable so you can change it at some point. 
let fishX = 0, fishY = 0;
let scubaX = 60, scubaY = 60;
scuba.width = 80, scuba.height = 80;
plastic.width = 60, plastic.height = 60;
let plasticY = 0, plasticX = 0;
let isRight = false, isLeft = false, isUp = false, isDown = false;

let score = 0;
let fishArr = []
let plasticArr = []

let fishSpeed = 2
let lives = 3

let energyX = 500, energyY = 400;
let speedScuba = 1


function fishArray() {
    let extra = 0
    for(i=0; i<20; i++) {
        fishArr.push({x: Math.random()*(canvas.width) + 100 + extra, y: Math.random()*(canvas.height) - 40})
        extra += 50
    }
}

function plasticArray() {
    let extra = 0
    for(i=0; i<20; i++) {
        plasticArr.push({x: Math.random()*(canvas.width) + 40 + extra+ plastic.height, y: Math.random()*(canvas.height) - plastic.width})
        extra += 50
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
    gameoverSound.play()
    backgroundMusic.pause()
    canvas.style.display = 'none';
    restartBtn.style.display = 'block';
    won.style.display = 'block';
    startBtn.style.display = 'none';
    calculateHighscores()

    // reset all the variables
    scubaY = 40;
    scubaX = 40;
    isGameOver = false;
    plasticArr = []
    fishArr = []
    score = 0
    fishSpeed = 2
    lives = 3
    speedScuba = 1
    energy.src = "./images/bar.png"
}

function scubaMove() {
     // move the scubaguy
    if (isRight && scubaX + scuba.width < canvas.width) {
        if (speedScuba == 0) {
            scubaX = scubaX + 7
        }
        scubaX = scubaX + 5
    }

    if (isLeft && scubaX > 0) {
        if (speedScuba == 0) {
            scubaX = scubaX - 7
        }
        scubaX = scubaX - 5
    }

    if (isDown && scubaY + scuba.width < canvas.height) {
        if (speedScuba == 0) {
            scubaY = scubaY + 7
        }
        
        scubaY = scubaY + 5
    }
    if (isUp && scubaY > 0) {
        if (speedScuba == 0) {
            scubaY = scubaY - 7
        }
        scubaY = scubaY - 5
    }
}



function energyBar() {
    //draw enegery bar
    if (energyX < scubaX + scuba.width && energyX + 40 > scubaX
    && energyY < scubaY + scuba.height && energyY + 40 > scubaY) {
        speedScuba = 0
        eat.play()
        energy.src = ""
    }
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
    
    // scuba image 
    if (isRight == true || isLeft == false) {
        ctx.drawImage(scuba, scubaX, scubaY, scuba.width, scuba.height)
    }


    else if (isLeft == true){
        ctx.drawImage(scubaLeft, scubaX, scubaY, scuba.width, scuba.height)
    }

    
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
        if (scubaX + 50 >= fishArr[i].x && scubaX <= fishArr[i].x + 40){
            if (scubaY + 50 >= fishArr[i].y && scubaY <= fishArr[i].y + 40){
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

    energyBar()
    scubaMove()

    //draw energybar
    ctx.drawImage(energy, energyX, energyY, 40, 40)

    for (j=0; j<plasticArr.length; j++){

        //draw plastic 
        ctx.drawImage(plastic, plasticArr[j].x, plasticArr[j].y, 60, 60)

        // speed of the plastic
        plasticArr[j].x = plasticArr[j].x - 1

        // let plastic come back again 
        if (plasticArr[j].x + plastic.width < 0) {
            plasticArr[j].x = canvas.width
            plasticArr[j].y = Math.random()*(canvas.height)
        }
        
        
            
        // collision plastic 
        if (plasticArr[j].x < scubaX + scuba.width && plasticArr[j].x + plastic.width > scubaX
            && plasticArr[j].y < scubaY + scuba.height && plasticArr[j].y + plastic.height > scubaY) {
            score++
            plasticSound.play()
            
            // increase speed of fish if score is higher
            if (score > 2) {
                fishSpeed = fishSpeed + 0.5
            }
            else if (score > 6) {
                fishSpeed = fishSpeed + 1
            }
            else if (score > 10) {
                fishSpeed = fishSpeed + 3
            }

            // mutates the original plastic Array.
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