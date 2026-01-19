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
    gravity: 0.5,
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
        obstacleSpeed: 5,
        obstacles: [
            { x: 2920, y: 620, width: 80, height: 80 },
            { x: 4700, y: 620, width: 80, height: 80 },
            { x: 5040, y: 470, width: 80, height: 80 },
            { x: 5420, y: 620, width: 80, height: 80 },

            { x: 6580, y: 620, width: 80, height: 80 },
            { x: 6900, y: 480, width: 80, height: 220 },

            { x: 7230, y: 340, width: 80, height: 360 },
            { x: 7550, y: 260, width: 700, height: 440 },
            { x: 8410, y: 350, width: 400, height: 350},
            { x: 8970, y: 625, width: 80, height: 80},

            { x: 10080, y: 580, width: 400, height: 120},
            { x: 10600, y: 480, width: 80, height: 40},
            { x: 11000, y: 420, width: 80, height: 40},
            { x: 11390, y: 360, width: 80, height: 40},
            { x: 11750, y: 350, width: 100, height: 350},
        ],
        triangles: [
            { x: 2000, y: 625, width: 80, height: 75},
            { x: 3000, y: 625, width: 80, height: 75},
            { x: 4000, y: 625, width: 80, height: 75},
            { x: 4780, y: 625, width: 80, height: 75},
            { x: 4860, y: 625, width: 80, height: 75},
            { x: 4940, y: 625, width: 80, height: 75},
            { x: 5020, y: 625, width: 80, height: 75},
            { x: 5100, y: 625, width: 80, height: 75},
            { x: 5180, y: 625, width: 80, height: 75},
            { x: 5260, y: 625, width: 80, height: 75},
            { x: 5340, y: 625, width: 80, height: 75},

            { x: 6660, y: 625, width: 80, height: 75},
            { x: 6740, y: 625, width: 80, height: 75},
            { x: 6820, y: 625, width: 80, height: 75},

            { x: 6980, y: 625, width: 80, height: 75},
            { x: 7070, y: 625, width: 80, height: 75},
            { x: 7150, y: 625, width: 80, height: 75},

            { x: 7310, y: 625, width: 80, height: 75},
            { x: 7390, y: 625, width: 80, height: 75},
            { x: 7470, y: 625, width: 80, height: 75},
            
            { x: 8250, y: 625, width: 80, height: 75},
            { x: 8330, y: 625, width: 80, height: 75},

            { x: 8810, y: 625, width: 80, height: 75},
            { x: 8890, y: 625, width: 80, height: 75},

            { x: 10000, y: 625, width: 80, height: 75},

            { x: 10480, y: 625, width: 80, height: 75},
            { x: 10560, y: 625, width: 80, height: 75},
            { x: 10640, y: 625, width: 80, height: 75},
            { x: 10710, y: 625, width: 80, height: 75},
            { x: 10790, y: 625, width: 80, height: 75},
            { x: 10870, y: 625, width: 80, height: 75},
            { x: 10950, y: 625, width: 80, height: 75},
            { x: 11030, y: 625, width: 80, height: 75},
            { x: 11110, y: 625, width: 80, height: 75},
            { x: 11190, y: 625, width: 80, height: 75},
            { x: 11270, y: 625, width: 80, height: 75},
            { x: 11350, y: 625, width: 80, height: 75},
            { x: 11430, y: 625, width: 80, height: 75},
            { x: 11510, y: 625, width: 80, height: 75},
            { x: 11590, y: 625, width: 80, height: 75},
            { x: 11670, y: 625, width: 80, height: 75},

        ]
    },
    {
        obstacleSpeed: 5.2,
        obstacles: [
            
            
            // { x: 3860, y: 420, width: 80, height: 80 },
            // { x: 4140, y: 420, width: 400, height: 80 },
            // { x: 4700, y: 420, width: 400, height: 80 }
        ],
        triangles: [
            // { x: 2000, y: 625, width: 75, height: 75},
            // { x: 2750, y: 625, width: 75, height: 75},
            // { x: 3330, y: 625, width: 75, height: 75},
            // { x: 3405, y: 625, width: 75, height: 75},
            // { x: 3480, y: 625, width: 75, height: 75},
            // { x: 3555, y: 625, width: 75, height: 75},
            // { x: 3635, y: 625, width: 75, height: 75}
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
            alert("Game over");
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
            alert("Victory!")
        }
    }
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

