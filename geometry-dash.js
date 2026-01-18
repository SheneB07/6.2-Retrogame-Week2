const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

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
    jumpPower: -16,
    gravity: 0.8,
    grounded: false
};

//Grond
const groundHeight = 50;
const groundOffset = -50;
const groundY = canvas.height - groundHeight - groundOffset;

//Vierkant
let obstacleSpeed = 6;
const obstacleWidth = 80;
const obstacleHeight = 80;
const obstacle = {
    x: 2000,
    y: 620,
    width: 80,
    height: 80,
    grounded: false
};

//Driehoek
const triangleSpeed = 6;
const triangle = {
    x: 2080,
    y: 625,
    size: 75,
    width: 75,
    height: 75
};

//levels
let currentLevel = 0;
let obstacleList = [];
let triangleList = [];

const levels = [
    {
        obstacleSpeed: 6,
        obstacles: [
            { x: 2000, y: 620, width: 80, height: 80 },
            
        ],
        triangles: [
            { x: 2080, y: 625, width: 75, height: 75}
        ]
    },
    {
        obstacleSpeed: 6,
        obstacles: [
            { x: 1800, y: 620, width: 80, height: 80 }
        ],
        triangles: [
            { x: 2280, y: 620, width: 80, height: 80}
        ]
    }
    
];

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
        if (rectCollision(player, t)) {
            console.log("Game over");
            location.reload();
        }
    });

//Blok collision
obstacleList.forEach(o => {
if(
    player.x + player.width > o.x &&
    player.x < o.x + o.width &&
    player.y + player.height <= o.y + 10 &&
    player.y + player.height + player.yVelocity >= o.y
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
    ctx.fillStyle = "#444";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);

    //Speler
    ctx.fillStyle = "#ff9100ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    //Obstakel
    ctx.fillStyle = "black";
    obstacleList.forEach(o => {
        ctx.fillRect(o.x, o.y, o.width, o.height);
    });
    

    //Driehoek
    triangleList.forEach(t => {
    ctx.beginPath();
    ctx.moveTo(t.x, t.y + t.height);
    ctx.lineTo(t.x + t.width /2, t.y);
    ctx.lineTo(t.x + t.width, t.y + t.height);
    ctx.closePath();

    ctx.fillStyle = "black";
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

function loadLevel(index){
    const level = levels[index];

    obstacleList = level.obstacles.map(o => ({...o}));
    triangleList = level.triangles.map(t => ({...t}));

    obstacleSpeed = level.obstacleSpeed;
}

loadLevel(currentLevel);

function checkLevelComplete(){
    const lastObstacle = obstacleList[obstacleList.length - 1];
    if(lastObstacle && lastObstacle.x + lastObstacle.width < 0){
        currentLevel++;
        if(currentLevel < levels.length) {
            loadLevel(currentLevel);
        } else {
            console.log("Victory!")
        }
    }
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

