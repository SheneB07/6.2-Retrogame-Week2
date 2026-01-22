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
    width: 100,
    height: 100,
    yVelocity: 0,
    jumpPower: -17,
    gravity: 0.7,
    grounded: false,
    rotation: 0,
    rotationSpeed: 0.13,
    skin: new Image()
};

// Load the skin from localStorage (or default if nothing chosen)
const savedSkin = localStorage.getItem("selectedSkin");
player.skin.src = savedSkin ? savedSkin : "assets/cube-1.png";



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

//Speler
const playerImage = new Image();
playerImage.src = "assets/cube-2.png"

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
    "................................................................................................................................................",
    ".............................#...#...#...#...#......................................................######......................................",
    "..........................#..#.............................................................######............#...#...#..........................",
    ".......^#.......^#.....#^^#^^#^^^^^^^^^^^^^^^^^^#..........^............^..............#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#............^#.........",
    "................................................................................................................................................",
    "................................................................................................................................................"
    ],
    [
    "................................................................................................................................................",
    ".................................................................#...#...#......................................................................",
    ".....................................#...#...#...#...#...#...#...............#...#...#...#....................#.................................",
    ".........^.......^.......^.......#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#............#^^^#^^^#.............................",
    "................................................................................................................................................",
    "................................................................................................................................................"
    ],
    [
    "................................................................................................................................................",
    ".................######...######...................................................................................#............................",
    ".............#.....................#...#...#...#...............................................................#.......#........................",
    ".........#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#...................^...........#^...........#^.........#^^^^^^^^^^^^^^^#....................",
    "................................................................................................................................................",
    "................................................................................................................................................"
    ],
    [
    "................................................................................................................................................",
    ".................................................#...#.................................#...#...#...#...#........................................",
    ".....................................#...#...#...........#...#.....................#...#...................#....................................",
    "........^....#....^....#....^....#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#.............#^^^#^^^#^^^^^^^^^^^^^^^^^^^^^^^#.........^...........^..........",
    "................................................................................................................................................",
    "................................................................................................................................................",
    ],
    [
    "................................................................................................................................................",
    "................................................................................................................................................",
    ".....................####...#...#...#...#...#...#####.......................................##...##.............................................",
    ".......#....#....#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#..........^.........^.........##^^^^^^^^^^^^^#......^......^#..........................",
    "................................................................................................................................................",
    "................................................................................................................................................",
    ]
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

if(!player.grounded) {
    player.rotation += player.rotationSpeed;
} else {
    player.rotation = 0;
}




checkLevelComplete();
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Grond
    ctx.fillStyle = "#000000ff";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);

    //Speler
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.rotation);
    ctx.drawImage(player.skin, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();

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

const LEVEL_LENGTH = 510;

function checkLevelComplete(){
    if(player.x >= LEVEL_LENGTH){
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

//Achtergrond muziek
const music = document.getElementById("background-music");
window.addEventListener("load", () => {
    music.volume = 0.5;
    music.play().catch(() =>{
        console.log("play music")
    })
})

gameLoop();

