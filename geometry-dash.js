const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

const   TILE_SIZE = 90;

//Canvas grootte
canvas.width = 1300;
canvas.height = 700;

//Speler
const player = {
    x: 500,
    y: 300,
    width: 80,
    height: 80,
    yVelocity: 0,
    jumpPower: -17,
    gravity: 0.7,
    grounded: false
};

//Grond
const groundHeight = 50;
const groundOffset = -65;
const groundY = canvas.height - groundHeight - groundOffset;

//Vierkant
let obstacleSpeed = 6;
const obstacleWidth = 80;
const obstacleHeight = 80;
const obstacle = {
    x: 2000,
    y: 620,
    width: 50,
    height: 50,
    grounded: false
};

//Blok
const blockImage = new Image();
blockImage.src = "assets/block.png";

//Driehoek
const triangleSpeed = 6;
const triangle = {
    x: 2080,
    y: 625,
    size: 75,
    width: 75,
    height: 75
};

const tileMap = [
    [
    "........................",
    "........................",
    "........................",
    ".......^#...............",
    "........................",
    ".......................",
    ],
    [
    "........................",
    "........................",
    "........................",
    "........##..............",
    "........................",
    ".......................",
    ],
]

let currentLevel = 0;
let obstacleList = [];
let triangleList = [];


//Controls
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.grounded){
        player.yVelocity = player.jumpPower;
        player.grounded = false;
    }
});

function update(){
//Zwaartekracht
    player.yVelocity += player.gravity;
    player.y += player.yVelocity;

//Obstakels
    obstacleList.forEach(o => o.x -= obstacleSpeed);
    triangleList.forEach(t => t.x -= obstacleSpeed);

//Grond collision
    if(player.y + player.height >= groundY){
        player.y = groundY - player.height;
        player.yVelocity = 0;
        player.grounded = true;
    }
//Driehoek collision = Game over
    triangleList.forEach(t => {
        const hitbox = {
            x: t.x + 10,
            y: t.y + 10,
            width: t.width,
            height: t.height - 20
        };
        if (rectCollision(player, hitbox)) {
            alert("Game over");
            location.reload();
        }
    });
        

            
    
           
        

//Blok collision
obstacleList.forEach(o => {
    const playerBottom = player.y + player.height;
    const playerTop = player.y;

    // horizontal overlap
    const overlapX =
        player.x + player.width > o.x &&
        player.x < o.x + o.width;

    // landing on top
    if (
        overlapX &&
        player.yVelocity >= 0 && // falling
        playerBottom <= o.y + player.yVelocity &&
        playerBottom >= o.y
    ) {
        player.y = o.y - player.height;
        player.yVelocity = 0;
        player.grounded = true;
    }
});




checkLevelComplete();
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Grond
    ctx.fillStyle = "#000000ff";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);

    //Speler
    ctx.fillStyle = "#ff9100ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    //Obstakel
    
    obstacleList.forEach(o => {
        ctx.drawImage(blockImage, o.x, o.y, o.width, o.height);
    });
    

    //Driehoek
    triangleList.forEach(t => {
    ctx.beginPath();
    ctx.moveTo(t.x, t.y + t.height);
    ctx.lineTo(t.x + t.width /2, t.y);
    ctx.lineTo(t.x + t.width, t.y + t.height);
    ctx.closePath();

    ctx.fillStyle = "red";
    ctx.fill();
});
}

function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function getGroundY(){
    return canvas.height - groundHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

//Speler gameover
function rectCollision(a, b){
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function loadLevel(levelIndex){

            obstacleList = [];
            triangleList = [];

            const map = tileMap[levelIndex];

        map.forEach((row, rowIndex) => {
            [...row].forEach((tile, colIndex) => {
                        const x = colIndex * TILE_SIZE + canvas.width;
                        const y = getGroundY() - TILE_SIZE * (map.length - rowIndex);

                    if(tile === "#"){
                        obstacleList.push({
                        x,
                        y,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        });
                    }
                if (tile === "^") {
                    triangleList.push({
                        x,
                        y,
                        width: TILE_SIZE / 1,
                        height: TILE_SIZE,
                    });
                }
            });
        });
}

loadLevel(currentLevel);

function checkLevelComplete(){
    const lastObstacle = obstacleList[obstacleList.length - 1];
    if(lastObstacle && lastObstacle.x + lastObstacle.width < 0){
        currentLevel++;
        if(currentLevel < tileMap.length) {
            loadLevel(currentLevel);
        } else {
            alert("Victory!")
        }
    }
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

//Achtergrond animatie
   let x = 0;
    const speed = 0.7;
    
    function animate(){
        x -= speed;
        canvas.style.backgroundPosition = `${x}px 0`;
        requestAnimationFrame(animate);
    }



    animate();

gameLoop();

