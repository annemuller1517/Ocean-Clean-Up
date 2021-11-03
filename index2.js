let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


let startBtn = document.querySelector('#start')
startBtn.style.display = "none"

let instructionBtn = document.querySelector('#instruction')

let restartBtn = document.querySelector('#restart')
restartBtn.style.display = "none"
let intro = document.querySelector(".startPage")
intro.style.display = "none"
let instructions = document.querySelector(".instructionPage")
instructions.style.display = "none"
let won = document.querySelector(".wonPage")
won.style.display = "none"
let first = document.getElementById('firstPlace')
let second = document.getElementById('secondPlace')
let third = document.getElementById('thirdPlace')

// load all images
let bg = new Image();
bg.src = "./images/oceanBackground.png";

let gameOverBg = new Image();
gameOverBg.src = "./Images/ocean.jpg"

// let startBg = new image ();
// startBg.src = "./Images/ad0933eb-0345-46b9-ab12-619b43994df4.png"

let fish = new Image();
fish.src = './images/fish.png';

let bin = new Image();
bin.src = './images/scubaguy.png'

let plastic = new Image();
plastic.src = './images/plasticBottle.png'

let intervalId = 0;
let isGameOver = false;
//make global variable so you can change it at some point. 
let fishX = 0, fishY = 0;
let binX = 60, binY = 60;
bin.width = 100, bin.height = 100;
plastic.width = 60, plastic.height = 60;
let plasticY = 0, plasticX = 0;
let isRight = false, isLeft = false, isUp = false, isDown = false;

let score = 0;
let fishArr = []
let plasticArr = []

let fishSpeed = 2
let collisionFish = 0


let backgroundMusic = new Audio('./sounds/disney_instrumental_neverland_orchestra_under_the_sea_TZsy_XIByoK-gucZwiP_.mp3')
let plasticSound = new Audio("./sounds/Plastic-sound.mp3")
let fishSound = new Audio("./sounds/mixkit-ow-exclamation-of-pain-2204.wav")

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
    backgroundMusic.pause()
    canvas.style.display = "none"
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
    collisionFish = 3
}

function startScreen() {
    canvas.style.display = "none"
    instructions.style.display = "none"
    startBtn.style.display = "block"


    backgroundMusic.play()
    intro.style.display = "block"   
}




// basic animation template
function draw(){

    backgroundMusic.play()

    // canvas setup
    startBtn.style.display = "nones"
    intro.style.display = "none";
    canvas.style.display = 'block';
    won.style.display = "none";
    // ctx.clearRect(0, 0, canvas.width, canvas.length)

    // background image 
    ctx.drawImage(bg, 0,0, canvas.width, canvas.height)
    
    // bin image 
    ctx.drawImage(bin, binX, binY, bin.width, bin.height)


    ctx.font = '24px Verdana'
    ctx.fillStyle = 'white'
    ctx.fillText(`Score: ${score} `, 10, 20)

    ctx.font = '24px Verdana'
    ctx.fillStyle = 'white'
    ctx.fillText(`Lives: ${collisionFish} `, 10, 40)


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
                collisionFish--
                
                // game is over after 3 lives 
                if (collisionFish < 1) {
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
                fishSpeed = fishSpeed + 1
            }
            else if (score > 6) {
                fishSpeed = fishSpeed + 2
            }
            else if (score > 10) {
                fishSpeed = fishSpeed + 4
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
    canvas.style.display = "none"
    startScreen()

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
        draw()
        plasticArray()
        fishArray()
        score = 0
        collisionFish = 3
    })
    
    restartBtn.addEventListener('click', () => {
        draw()
        plasticArray()
        fishArray()
        
    })

})
