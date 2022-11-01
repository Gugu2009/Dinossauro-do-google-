//gameStates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Variavel T-rex e Animação
var trex ,trex_running,trex_collided;

//Variavel Chão
var ground, invisibleGround, groundImage;

//sprite Nuvem
var cloud, cloudsGroup, cloudImage;

//Variavel Cactos
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Variavel Pontuação
var score;

// Imagem game over e restart
var gameOverIMG, restartIMG;

// Sons
var jumpSound, checkPointSound, dieSound;

// carrega imagens no codigo 
function preload(){
  
  // Carrega Animações e Imagens
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  //Imagem Chão
  groundImage = loadImage("ground2.png");

  //Imagem Nuvens
  cloudImage = loadImage("cloud.png");

  //Obstaculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  //Imagem Game Over e Restart
  gameOverIMG = loadImage ("gameOver.png");
  restartIMG = loadImage ("restart.png");

  //Sons
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");

}

//cria as sprites
function setup(){
  
  //Bordas
  createCanvas(windowWidth,windowHeight);
  
  //crie um sprite de trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;

//Sprite Chão
  ground = createSprite (width/2,height-20,width,125);
  ground.addImage ("ground", groundImage);
 //Deixando Chão infinito
  ground.x = ground.width /2;
  
  //Imagem Game Over
 gameOver = createSprite (width/2,height/2- 50);
 gameOver.addImage(gameOverIMG);

 //Image Restart
 restart = createSprite (width/2,height/2);
 restart.addImage(restartIMG);

 //tamanho
 restart.scale = 0.5;
 gameOver.scale = 0.5;
 // Chão Invisivel
 invisibleGround = createSprite (width/2,height-10,width,125);
 invisibleGround.visible = false;

 //Grupo dos Obstaculos e das Nuvens
 obstaclesGroup = createGroup();
 cloudsGroup = createGroup();


 trex.setCollider("circle",0,0,40);
 //trex.debug = true;

 // Definição de Quanto Vale a Pontuação Inicialmente
 score = 0;
 
}

//cria tudo q vai acontecer infinitamente
function draw(){
 
  background("silver");
  
  //Exibindo Pontuação
  textSize(30);
  text("Pontuação: " + score,100,50);


  if (gameState === PLAY) {
    
    //Game Over e Restart Invisivel
    gameOver.visible = false;
    restart.visible = false;

    //Velcidade Chão
    ground.velocityX = -(4 + 2* score/100) ;
    //Mudança Pontuação
    score = score + Math.round(getFrameRate()/60);
    //Pulo Dinossauro
    if (touches.legth > 0 || keyDown("SPACE") && trex.y>= height-80) {
      jumpSound.play()
      trex.velocityY = -10
      touches = []
     }
    //Som a Cada 200 Pontos
    if (score > 0 && score % 200 === 0) {
    checkPointSound.play()
    }
       //Geração Chão
   if (ground.x < 0 ) {
    ground.x = ground.width /2;
    }
    
    //Gravidade Dinossauro
    trex.velocityY = trex.velocityY + 0.8;

    //Nuvens
   spawn_Clouds();

   //Obstaculos(Cactos)
   spawn_Obstacles ();

   if (obstaclesGroup.isTouching(trex)) {
   //Som da Morte
   dieSound.play();
   gameState = END;
   }
   }

  
   else if (gameState === END) {
    
   // velocidade de tudo = 0 
   ground.velocityX = 0;
   trex.velocityY = 0;
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);

   trex.changeAnimation("collided", trex_collided);
   
   //Game Over e Restart Visivel
   gameOver.visible = true;
   restart.visible = true;

   //Tempo que Objetos Ficam na tela
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setLifetimeEach(-1);

   if (mousePressedOver(restart)) {
    reset()
   }
   }
   // Colisão T-rex com o Chão Invisivel
    trex.collide(ground);
   
   

   drawSprites();
  }

  function reset (){
 gameState = PLAY;
 gameOver.visible = false;
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 score = 0;
 trex.changeAnimation("running", trex_running);
  }
// Geração Nuvens
 function spawn_Clouds(){
  if (frameCount % 60 === 0){
  cloud = createSprite (width+20,height-300,40,10);
  cloud.addImage(cloudImage);
  cloud.y = Math.round(random(20,200));
  cloud.velocityX = -3;
  // Profundidade
  cloud.depth = trex.depth ;
  trex.depth = trex.depth + 1 ;
 //Tempo que Nuvem Tem Antes de ser Destruida
  cloud.lifetime = 1000;
  
 cloudsGroup.add(cloud);
  }

}
 
  function spawn_Obstacles (){
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width-10 ,height-30 ,20 ,30);
    obstacle.setCollider('circle',0,0,45)
    obstacle.velocityX = -(6 + score/500);

    var rand = Math.round(random(1,6));
    switch(rand) {
   case 1: obstacle.addImage(obstacle1);
          break;
   case 2: obstacle.addImage(obstacle2);
          break;
   case 3: obstacle.addImage(obstacle3);
          break;
   case 4: obstacle.addImage(obstacle4);
          break;
   case 5: obstacle.addImage(obstacle5);
          break;
   case 6: obstacle.addImage(obstacle6);
          break;
          default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);

   
  }
}
