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
    

//Grond collision
    if(player.y + player.height >= canvas.height - groundHeight){
        player.y = canvas.height - groundHeight - player.height;
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

}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

