//Canvas
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

//Blok grootte 
const TILE_SIZE = 90;

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
    jumpPower: -14,
    gravity: 0.6,
    grounded: false,
    rotation: 0,
    rotationSpeed: 0.13,
    skin: new Image()
};

//Skins inladen
const savedSkin = localStorage.getItem("selectedSkin");
player.skin.src = savedSkin ? savedSkin : "assets/cube-1.png";

//Game-over & Victory schermen
const gameOverScreen = document.getElementById("game-over-screen");
const victoryScreen = document.getElementById("victory-screen");

const retryButton = document.getElementById("retry-button");
const nextButton = document.getElementById("next-button");


//Grond
const groundHeight = 50;
const groundOffset = -65;
const groundY = canvas.height - groundHeight - groundOffset;

//Vierkant
let obstacleSpeed = 7;

//Blok
const blockImage = new Image();
blockImage.src = "assets/block.png";

//Ster
const starImage = new Image();
starImage.src = "assets/star-icon.webp"

let gameState = "playing";

//Level mappen 
const tileMap = [
    [
        "................................................................................................................................................",
        ".............................#...#...#...#...#......................................................######......................................",
        "..........................#..#.............................................................######............#...#...#................*.........",
        ".......^#.......^#.....#^^#^^#^^^^^^^^^^^^^^^^^^#..........^#...........^#.............#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#............^#.........",
        "................................................................................................................................................",
        "................................................................................................................................................"
    ],
    [
        "................................................................................................................................................",
        ".................................................................#...#...#......................................................................",
        ".....................................#...#...#...#...#...#...#...............#...#...#...#....................#..........*......................",
        ".........^.......^.......^.......#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#............#^^^#^^^#......*......................",
        "................................................................................................................................................",
        "................................................................................................................................................"
    ],
    [
        "................................................................................................................................................",
        ".................######...######...................................................................................#............................",
        ".............#.....................#...#...#...#...............................................................#.......#...........*............",
        ".........#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#...................^...........#^...........#^.........#^^^^^^^^^^^^^^^#.......*............",
        "................................................................................................................................................",
        "................................................................................................................................................"
    ],
    [
        "................................................................................................................................................",
        ".................................................#...#.................................#...#...#...#...#........................................",
        ".....................................#...#...#...........#...#.....................#...#...................#...............................*....",
        "........^..........^.............#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#.............#^^^#^^^#^^^^^^^^^^^^^^^^^^^^^^^#.........^...........^.....*....",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
    [
        "................................................................................................................................................",
        "................................................................................................................................................",
        ".....................####...#...#...#...#...#...#####.......................................##...##.............................*...............",
        ".......#....#....#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#..........^.........^.........##^^^^^^^^^^^^^#......^......^#..........*...............",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
    [
        "...............................................................##...............................................................................",
        "........................................................####........#...........................................................................",
        "....................................................#...................#...............#...#...#...#............................*..............",
        ".........^............^.............^...........#^^^^^^^^^^^^^^^^^^^^^^^^^^^#.......#^^^^^^^^^^^^^^^^^^^#..............^.........#..............",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
    [
        ".....................####.......................................................................................................................",
        ".................#..........#...........................................................#...#...................................................",
        ".............#...#..............###.........................................#...#...#...........#...#...#......................*................",
        ".........#^^^#^^^#^^^^^^^^^^^^^^^^^^^^#.........^#..........^#..........#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#.................^#.................",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
    [
        "........................................................#...#...#...#...........................................................................",
        "....................................................#...#...............#................................................*......................",
        "................................................#...#...#...................#............................................#......................",
        "............#..........#.........#.........^#^^^#^^^#^^^#^^^^^^^^^^^^^^^^^^^^^^^#..........^.............^...........#^^^#......................",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
    [
        "................................................................................................................................................",
        ".....................#...#......................................................................................................................",
        ".................#...#.......####...#...#...#...#...#...#...####.......................................#...#................*...................",
        "............^#^^^#^^^#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#........^............^#........#^^^^^^^^^^^#............*...................",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
    [
        "................................................................................................................................................",
        ".........................................................#.....................................#...#...#...#....................................",
        ".....................................................#...#.................................#...................#.................*..............",
        "...............^#.........#.........^#...........#^^^#^^^#..........^..................#^^^^^^^^^^^^^^^^^^^^^^^^^^^#.............*..............",
        "................................................................................................................................................",
        "................................................................................................................................................",
    ],
]

//Level en obstakels
let currentLevel = 0;
let obstacleList = [];
let triangleList = [];

//Ster
let starList = [];


//Controls
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.grounded) {
        player.yVelocity = player.jumpPower;
        player.grounded = false;
    }
});

function update() {
    if (gameState !== "playing") return;

    //Zwaartekracht
    player.yVelocity += player.gravity;
    player.y += player.yVelocity;

    //Obstakels
    obstacleList.forEach(o => o.x -= obstacleSpeed);
    triangleList.forEach(t => t.x -= obstacleSpeed);

    //Grond collision
    if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.yVelocity = 0;
        player.grounded = true;
    }


    triangleList.forEach(t => {
    const A = {x: t.x, y: t.y + t.height};
    const B = {x: t.x + t.width / 2, y: t.y};
    const C = {x: t.x + t.width, y: t.y + t.height};

    const playerPoints = [
    {x: player.x, y: player.y},
    {x: player.x + player.width, y: player.y},
    {x: player.x, y: player.y + player.height},
    {x: player.x + player.width, y: player.y + player.height}
];

if(playerPoints.some(p => pointInTriangle(p, A, B, C))){
    showGameOver();
}

});
    //Blok collision
obstacleList.forEach(o => {
    if (!rectCollision(player, o)) return;

    if (
        player.yVelocity > 0 &&
        player.y + player.height - player.yVelocity <= o.y
    ) {
        player.y = o.y - player.height;
        player.yVelocity = 0;
        player.grounded = true;
    }
    else if (
        player.yVelocity < 0 &&
        player.y - player.yVelocity >= o.y + o.height
    ) {
        player.y = o.y + o.height;
        player.yVelocity = 0;
    }
    else if (player.x + player.width / 2 < o.x + o.width / 2) {
        player.x = o.x - player.width;
    }
    else {
        player.x = o.x + o.width;
    }
});

//Game over - van level afgeduwd
if (player.x + player.width < 0) {
    showGameOver();
}


    //Blok rotatie
    if (!player.grounded) {
        player.rotation += player.rotationSpeed;
    } else {
        player.rotation = 0;
    }

    //Ster
    starList.forEach(s => s.x -= obstacleSpeed);

    starList.forEach(s => {
        if (rectCollision(player, s)) {
            showVictory();
            console.log("activated");
        }
    })

}

function draw() {
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
        ctx.lineTo(t.x + t.width / 2, t.y);
        ctx.lineTo(t.x + t.width, t.y + t.height);
        ctx.closePath();

        ctx.fillStyle = "red";
        ctx.fill();
    });

    //Ster
    starList.forEach(s => {
        ctx.drawImage(starImage, s.x, s.y, s.width, s.height);
    });
}
//Canvas
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

//Grond
function getGroundY() {
    return canvas.height - groundHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

//Speler gameover
function rectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function pointInTriangle(p, a ,b ,c){
    const sign = (p1, p2, p3) =>
    (p1.x - p3.x) * (p2.y - p3.y) -
    (p2.x - p3.x) * (p1.y - p3.y);

    const d1 = sign (p, a, b);
    const d2 = sign (p, b ,c);
    const d3 = sign (p, c, a);

    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return!(hasNeg && hasPos);
}



//Level laden
function loadLevel(levelIndex) {

    obstacleList = [];
    triangleList = [];
    starList = [];

    const map = tileMap[levelIndex];

    map.forEach((row, rowIndex) => {
        [...row].forEach((tile, colIndex) => {
            const x = colIndex * TILE_SIZE + canvas.width;
            const y = getGroundY() - TILE_SIZE * (map.length - rowIndex);

            if (tile === "#") {
                obstacleList.push({
                    x, y, width: TILE_SIZE, height: TILE_SIZE
                });
            }
            if (tile === "^") {
                triangleList.push({
                    x, y, width: TILE_SIZE, height: TILE_SIZE
                });
            }
            if (tile === "*") {
                starList.push({
                    x, y, width: TILE_SIZE, height: TILE_SIZE
                });
            }
        });
    });
}

loadLevel(currentLevel);

//Gameover & victory
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function showGameOver() {
    gameState = "paused";
    gameOverScreen.classList.remove("hidden");
}

function showVictory() {
    gameState = "paused";
    victoryScreen.classList.remove("hidden");
}

function hideScreens() {
    gameOverScreen.classList.add("hidden");
    victoryScreen.classList.add("hidden");
}

retryButton.addEventListener("click", () => {
    location.reload();
});

nextButton.addEventListener("click", () => {
    hideScreens();
    currentLevel++;
    loadLevel(currentLevel);
    gameState = "playing";
});

//Achtergrond animatie
let x = 0;
const speed = 0.7;

function animate() {
    x -= speed;
    canvas.style.backgroundPosition = `${x}px 0`;
    requestAnimationFrame(animate);
}

//Sneeuw
const snowLayer = document.getElementById("snowlayer");
for (var i = 0; i < 50; i++) {
    let leftSnow = Math.floor(Math.random() * window.innerWidth);
    let topSnow = Math.floor(Math.random() * window.innerHeight);
    let widthSnow = Math.floor(Math.random() * 60);
    let timeSnow = Math.floor((Math.random() * 5) + 5);
    let div = document.createElement("div");
    div.classList.add("snow");
    div.style.left = leftSnow + 'px';
    div.style.top = topSnow + 'px';
    div.style.width = widthSnow + 'px';
    div.style.height = widthSnow + 'px';
    div.style.animationDuration = timeSnow + 's';
    snowLayer.appendChild(div);
}
animate();

//Achtergrond muziek
const music = document.getElementById("background-music");
window.addEventListener("load", () => {
    music.volume = 0.5;
    music.play().catch(() => {
        console.log("play music")
    })
})

gameLoop();

