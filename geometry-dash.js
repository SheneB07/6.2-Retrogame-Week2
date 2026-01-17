const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");



canvas.width = 1200;
canvas.height = 600;

//Speler
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    yVelocity: 0,
    jumpPower: -12,
    gravity: 0.6,
    grounded: false
};



//Grond
const groundHeight = 50;

//Obstakel
const obstacleSpeed = 3;
const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacle = {
    x: 1200,
    y: 500,
    width: 40,
    height: 40,
    grounded: false
};

//Driehoek
const triangleSpeed = 3;
const triangle = {
    x: 1250,
    y: 500,
    size: 50,
    width: 50,
    height: 50
};

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
    obstacle.x -= obstacleSpeed;
    triangle.x -= triangleSpeed;

//Grond collision
    if(player.y + player.height >= canvas.height - groundHeight){
        player.y = canvas.height - groundHeight - player.height;
        player.yVelocity = 0;
        player.grounded = true;
    }
//Driehoek collision = Game over
    if(rectCollision(player, triangle)) {
        console.log("Game over");
        location.reload();
    }

//Blok collision
if(
    player.x + player.width > obstacle.x &&
    player.x < obstacle.x + obstacleWidth &&
    player.y + player.height <= obstacle.y + 10 &&
    player.y + player.height + player.yVelocity >= obstacle.y
) {
    player.y = obstacle.y - player.height;
    player.yVelocity = 0;
    player.grounded = true;
}

}



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Grond
    ctx.fillStyle = "#444";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    //Speler
    ctx.fillStyle = "#ff9100ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    //Obstakel
    ctx.fillStyle = "black";
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);

    //Driehoek
    
    ctx.beginPath();
    ctx.moveTo(triangle.x, triangle.y + triangle.size);
    ctx.lineTo(triangle.x + triangle.size /2, triangle.y);
    ctx.lineTo(triangle.x + triangle.size, triangle.y + triangle.size);
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fill();

}

//Speler gameover
function rectCollision(a, b){
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

