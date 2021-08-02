//global declaration of variables
var brickGroup;
var brickImage;
var coinsGroup;
var coinsImage;
var coinScore=0;
var mushImage;
var turImage;
var gameState="PLAY";
var marioDead;
var restart;
//function preload declaration
function preload(){ 
// loading the background image
bgImage=loadImage("images/bgnew.jpg");
//loading image of mario
mario_running=loadAnimation("images/mar1.png", "images/mar2.png", "images/mar3.png", "images/mar4.png", "images/mar5.png", "images/mar6.png","images/mar7.png")
//loading image of bricks
brickImage=loadImage("images/brick.png");
//loading image of coin
coinsImage=loadAnimation("images/con1.png", "images/con2.png", "images/con3.png","images/con4.png","images/con5.png", "images/con6.png");
//loading the sound of coins
coinSound=loadSound("sounds/coinSound.mp3");    
//loading the mushroom image
mushImage=loadAnimation("images/mush1.png","images/mush2.png","images/mush3.png","images/mush4.png","images/mush5.png","images/mush6.png");
//loading the turtle image
turImage=loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png");
mario_collided=loadAnimation("images/die.png");
deadSound=loadSound("sounds/dieSound.mp3");
jumpSound=loadSound("sounds/jump.mp3");
restartImage=loadImage("images/restart.png")
}

function setup() {
//create background sprite
createCanvas(1000, 600);
bg= createSprite(580,300);
bg.addImage(bgImage);
bg.scale =0.5;
bg.velocityX= -6;
//create mario sprite
mario= createSprite(200,505,20,50);
mario.addAnimation("running",mario_running);
mario.scale=0.3;
//create ground sprite
ground= createSprite(200,585,400,10);
ground.visible = false;
//create groups
brickGroup= new Group();
coinsGroup= new Group();
obstacleGroup= new Group();
restart= createSprite(500,300);
restart.addImage(restartImage);
restart.visible=false;





}

function draw(){
    if (gameState==="PLAY"){
        mario.setCollider("rectangle",0,0,200,500);
        mario.scale =0.3;
        bg.velocityX = -6;
//if (gameState==="PLAY"){
   // scroll background
    if(bg.x<100){
        bg.x=bg.width/4;
    }
    //prevent mario moving out with bricks
    if(mario.x<200){
        mario.x=200;
    }
    //preven mario moving out from top
    if (mario.y<50){
        mario.y=50;
    }
    //jump with space
    if(keyDown ("space")){
        mario.velocityY= -16
       
    }
    //gravity
    mario.velocityY= mario.velocityY +0.5
    mario.collide(ground);

//call funtion generate bricks
 generateBricks()
 //Make Mario step(collide) on bricks 
for (var i=0; i<(brickGroup).length; i++){
     var temp=brickGroup.get (i);
 if (temp.isTouching(mario))
     mario.collide(temp);
}
//call function to generate coins
 generateCoins();
 //make mario catch coins
 for (var i=0;i<(coinsGroup).length; i++ ){
        var temp=coinsGroup.get(i);
     if(temp.isTouching(mario)){
        //play sound if coin is caught
         coinSound.play();
        //increase coin score
         coinScore++;
        //destroy coins once caught
         temp.destroy();
         temp=null;
     }
 }

//call function to generate obstacles
generateObstacles();
if(obstacleGroup.isTouching(mario)){
    deadSound.play();
    gameState="END"}
}
    else if(gameState==="END"){
        bg.velocityX = 0;
      mario.velocityY = 0;  
      mario.velocityX = 0; 
      obstacleGroup.setVelocityXEach(0);
      coinsGroup.setVelocityXEach(0);
      brickGroup.setVelocityXEach(0);
      obstacleGroup.setLifetimeEach(-1);
      coinsGroup.setLifetimeEach(-1);
      brickGroup.setLifetimeEach(-1);
      mario.changeAnimation("collided",mario_collided);
      mario.scale=0.4;
      mario.setCollider("rectangle",0,0,300,10);
      mario.y=570;
      restart.visible=true;
    if (mousePressedOver(restart)){
        restartGame();
    }
    }


//display sprites on screen
  drawSprites();
  textSize(20);
  fill("brown");
  //display coin score
  text("Coins Collected: "+ coinScore, 500,50);
}
//body of function generate bricks
function generateBricks(){
    if (frameCount % 70===0){
        var brick =createSprite(1200,120,40,10);
        brick.y= random(50,450);
        brick.addImage(brickImage);
        brick.scale=0.5;
        brick.velocityX= -5;
        //to save memory space
        brick.lifetime =250;
        brickGroup.add(brick);
    }
}
//body of function generate coins
function generateCoins(){
    if(frameCount % 50===0){
        var coin= createSprite(1200,120,40,10);
        coin.addAnimation("coin", coinsImage);
        coin.y= Math.round(random(80,350));
        coin.scale=0.1;
        coin.velocityX= -3;
        coin.lifetime= 1200;
        coinsGroup.add(coin);
        
        
    
    }
}
//body of function generate obstacles
 function generateObstacles(){
     if (frameCount % 100===0){
         var obstacle= createSprite(1200,545,10,40);
         obstacle.velocityX= -4;
         obstacle.scale= 0.2;
         var r= Math.round(random(1,2));
        //to generate random obstacles
         switch (r){
             case 1: obstacle.addAnimation("mush", mushImage);
               break;
             case 2: obstacle.addAnimation("turtle", turImage);
               break;
             default:
               break;        
 
         }
         obstacle.lifetime= 300;
         obstacleGroup.add(obstacle);
     }

 }
 function restartGame(){
     gameState="PLAY"
     obstacleGroup.destroyEach();
     brickGroup.destroyEach();
     coinsGroup.destroyEach();
     mario.changeAnimation("running",mario_running);
     coinScore=0;
     restart.visible=false;
 }