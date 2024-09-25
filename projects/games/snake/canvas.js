const canvas = document.querySelector('canvas')
windowMultipliers =
{
    height: 5/7,
    width: 6/7
}
canvas.width = Math.floor(window.innerWidth * windowMultipliers.width);
canvas.height = Math.floor(window.innerHeight * windowMultipliers.height);

const c = canvas.getContext("2d");
const xpadding = 70;
const ypadding = 50;
let gameOver = false;
let snake = []
let apples = [];
let allApplesEver = 0;
var snakeColour;
const snakeSize = 15;
const appleSize = 10;
const peiceSeparation = 2 ;
var delay = 100; 
var lastTime = 0;
let score;
let scores = [];
// const fs = require('fs');

// // Read data from a file
// fs.readFile('scores.txt', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });


var border =
{
    topleft : {x:xpadding, y:ypadding},
    w : canvas.width - 2 * xpadding,
    h : canvas.height - 2 * ypadding,
    xpadding : xpadding,
    ypadding : ypadding,
    lineWidth : 7,
    colour : "white"
}

window.addEventListener('resize', resizeWindow);
function resizeWindow(event)
{
    canvas.width = Math.floor(window.innerWidth * windowMultipliers.height);
    canvas.height = Math.floor(window.innerHeight * windowMultipliers.width);
}

document.addEventListener('keydown', function(event)
{
    if(event.key == "w" || event.key == "W")
    {
	    currMovement = "up";
        // console.log(currMovement);
    }

    if(event.key == "a" || event.key == "A")
    {
        currMovement = "left";
        // console.log(currMovement);
    }

    if(event.key == "s" || event.key == "S")
    {
        currMovement = "down";
        // console.log(currMovement);
    }

    if(event.key == "d" || event.key == "D")
    {
        currMovement = "right";
        // console.log(currMovement);
    }

    // LIL CHEATS FOR ME
    if(event.key == "x" || event.key == "X")
    {
        snake = addPeice(snake);
        score += 10;
    }

    // if(event.key == "k" || event.key == "K")
    // {
    //     console.log("adding apple");
    //     apples = addApple(apples);
    //     console.log(apples);
    // }


    if(event.key == " " && gameOver)
    {
        gameOver = false;
        start();
    }
});

class Piece
{
    constructor(colour, startPosition, index, size)
    {
        this.colour = colour;
        this.position = startPosition;
        this.index = index;
        this.size = size;
    }

    getReadyToMove(snakes)
    {
        let indexBefore = this.index - 1;
        if(indexBefore >= 0)
        {
            this.nextMove = snakes[indexBefore].position;
        }
    }

    move()
    {
       this.position = this.nextMove;
        
    }

    getPosition()
    {
        return this.position;
    }

    draw()
    {
        c.fillStyle = this.colour;
        c.fillRect(this.position[0] - this.size/2, this.position[1] - this.size/2, this.size, this.size);
    }

}

class Apple
{
    //     EF476F
    constructor(colour, startPosition, index, size, timeLeft)
    {
        this.colour = colour;
        this.position = startPosition;
        this.index = index;
        this.size = size;
        this.timeLeft = timeLeft;
    }

    draw()
    {
        c.fillStyle = this.colour;
        c.fillRect(this.position[0] - this.size/2, this.position[1] - this.size/2, this.size, this.size);
    }

}

class Head extends Piece
{
    constructor(colour, startPosition, size)
    {
        super(colour, startPosition, 0, size);
    }

    getReadyToMove(snakes)
    {
        let newX = 0;
        let newY = 0;
        switch(currMovement)
        {
            case 'up':
                newY = this.position[1] - this.size - peiceSeparation;
                if(newY - border.lineWidth/2 < border.topleft.y) // hit top part of border
                {
                    gameOver = true;
                }
                this.nextMove = [this.position[0], newY];
                break;
            case 'left':
                newX = this.position[0] - this.size - peiceSeparation;
                if(newX - border.lineWidth/2 < border.topleft.x) // hit left part of border
                {
                    gameOver = true;
                }
                this.nextMove = [newX, this.position[1]];
                break;
            case 'down':
                newY = this.position[1] + this.size + peiceSeparation;
                if(newY + border.lineWidth/2 > border.topleft.y + border.h) // hit bottom part of border
                {
                    gameOver = true;
                }
                this.nextMove = [this.position[0], newY];
                break;
            case 'right':
                newX = this.position[0] + this.size + peiceSeparation;
                if(newX + border.lineWidth/2 > border.topleft.x + border.w) // hit right part of border
                {
                    gameOver = true;
                    console.log("gameoVER");
                }
                this.nextMove = [newX, this.position[1]];
                break;
            
        }

        apples = checkCollisions();
        // if(gameOver)
        // {
        //     fs.writeFile('scores.txt', score, (err) => {
        //         if (err) throw err;
        //         console.log('Score has been written to the file.');
        //     });
        // }
    }

}

function addPeice(snake)
{
    let pos = snake[snake.length - 1].getPosition();
    var newPos;
    let newXCoor = 0;
    let newYCoor = 0;
    switch(currMovement)
    {
        case 'up':
            newYCoor = pos[1] + snakeSize + peiceSeparation;
            newPos = [pos[0], newYCoor];
            break;
        case 'left':
            newXCoor = pos[0] + snakeSize + peiceSeparation;
            newPos = [newXCoor, pos[1]];
            break;
        case 'down':
            newYCoor = pos[1] - snakeSize - peiceSeparation;
            newPos = [pos[0], newYCoor];
            break;
        case 'right':
            newXCoor = pos[0] - snakeSize - peiceSeparation;
            newPos = [newXCoor, pos[1]];
            break;
        
    }
    let newPiece = new Piece(snakeColour, newPos, snake.length, snakeSize);
    // console.log(newPiece);
    snake.push(newPiece);

    return snake;
}

function addApple(apples)
{
    allApplesEver ++;

    let min =
    {
        x: border.topleft.x + border.lineWidth/2 + appleSize*2,
        y : border.topleft.y + border.lineWidth/2 + appleSize*2
    }

    let max =
    {
        x : border.topleft.x + border.w + border.lineWidth/2 - appleSize*2,
        y : border.topleft.y + border.h + border.lineWidth/2 - appleSize*2
    }

    let xPos = Math.random() * (max.x - min.x) + min.x;
    let yPos = Math.random() * (max.y - min.y) + min.y;

    // updates every {delay secs} e.g. 100ms
    let timeLeft = 5000 / delay;
    let apple = new Apple("#EF476F", [xPos, yPos], allApplesEver, appleSize, timeLeft);
    apples.push(apple);
    return apples;
}

function newSnake()
{
    snakeColour = "#073B4C"; // head
    let head = new Head(snakeColour, [canvas.width/2, canvas.height/2 ], snakeSize);
    snakeColour = "#118AB2"; // body
    snake = [head];
    snake = addPeice(snake);
}

function draw()
{
    for(var i = 0; i < apples.length; i++)
    {
        apples[i].draw();
        // console.log("drew", apples[i].index);
    }

    for(var i = 0; i < snake.length; i++)
    {
        snake[i].draw();
        //console.log("drew", snake[i].index);
    }

   drawScore();
}

function drawScore(){
    c.font = "35px boxy";
    c.fillStyle = "white";
    c.textAlign = "center"; // Center align the text horizontally
    c.textBaseline = "middle"; // Center align the text vertically
    c.fillText(score, Math.floor(window.innerWidth/2 * windowMultipliers.width), 25);
}

function drawSetup()
{
    c.beginPath();
    c.strokeStyle =  border.colour;
    c.lineWidth = border.lineWidth;
    c.rect(border.topleft.x, border.topleft.y, border.w, border.h);
    c.stroke();
}

function update()
{
    for(var i = 0; i < snake.length; i++)
    {
       snake[i].getReadyToMove(snake);
       // console.log(snake[i].nextMove);
    }
    for(var i = 0; i < snake.length; i++)
    {
        snake[i].move();
        // console.log(snake);
    }

    let newApples = []
    for(var i = 0; i < apples.length; i++)
    {
        let apple = apples[i];
        apple.timeLeft --;

        if(apple.timeLeft > 0)
        {
            newApples.push(apple);
        }
    }
    apples = newApples;

    var nChances = 7; // numebr of chances
    var chance = 0.01; // probability on each chance of apple created
    for(var i = 0; i < nChances; i++)
    {
        if(Math.random() < chance)
        {
            apples = addApple(apples);
        }
    }

}

function checkCollisions()
{
    let head = 
    {
        x: snake[0].position[0],
        y: snake[0].position[1],
        size: snake[0].size
    };
    let newApples = [];
    let delta = head.size;
    for(var i = 0; i < apples.length; i++)
    {
        let collision = false;
        let apple = 
        {
            x: apples[i].position[0],
            y: apples[i].position[1],
            size: apples[i].size
        };

        if((apple.x + delta >= head.x) && (apple.x - delta <= head.x) &&
        (apple.y + delta >= head.y) && (apple.y - delta <= head.y)) // to make sure in gen vicinity to reduce n of apples checked
        {
            collision = true;
            snake = addPeice(snake);
            score += 10;
        }
        
        if(!collision)
        {
            newApples.push(apples[i]);
        }
    }

    return newApples;
}

function animate()
{
    let currentTime = Date.now();
    let deltaTime = currentTime - lastTime;

    if (deltaTime >= delay && !gameOver)
    {
        lastTime = currentTime;
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);
        update();

        draw();
        drawSetup();
    }
    if(gameOver)
    {
        showGameOverScreen();
    }

    requestAnimationFrame(animate);

}

function showGameOverScreen()
{
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    c.beginPath();
    c.strokeStyle = "white";
    c.fillStyle = "white";
    c.lineWidth = border.lineWidth;
    c.rect(border.topleft.x, border.topleft.y, border.w, border.h);
    c.stroke();
    c.fill();

    c.font = "25px boxy";
    c.fillStyle = "black";
    c.textAlign = "center"; // Center align the text horizontally
    c.textBaseline = "middle"; // Center align the text vertically
    let text = "UH OH YA LOST BABES, PRESS SPACEBAR TO TRY AGAIN"
    c.fillText(text,Math.floor(window.innerWidth/2 * windowMultipliers.width), Math.floor(window.innerHeight/2 * windowMultipliers.height));

    drawScore();
}

function showStartScreen()
{
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    c.beginPath();
    c.strokeStyle = "white";
    c.fillStyle = "white";
    c.lineWidth = border.lineWidth + 10;
    c.rect(border.topleft.x, border.topleft.y, border.w, border.h);
    c.stroke();
    c.fill();

    c.font = "25px boxy";
    c.fillStyle = "black";
    c.textAlign = "center"; // Center align the text horizontally
    c.textBaseline = "middle"; // Center align the text vertically
    let text = "HELLO PRESS SPACEBAR TO BEGIN PLAYING!"
    c.fillText(text, Math.floor(window.innerWidth/2 * windowMultipliers.width), Math.floor(window.innerHeight/2 * windowMultipliers.height));
}

window.onload = function()
{
    gameOver = true;
    showStartScreen();
}

function start()
{
    currMovement = "right";
    apples = [];
    score = 0;
    drawSetup();
    newSnake();
    animate();
}