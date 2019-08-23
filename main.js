let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;
    

  let app = new Application({ 
    width: 900, 
    height: 512,                       
    antialiasing: true, 
    transparent: false, 
    resolution: 1
  }
  );

  document.body.appendChild(app.view);
  loader
  .add("images/player.png")
  .add("images/tree.webp")
  .add("images/heart.webp")
  .add("images/back.webp")
  .load(setup);

let player, tree, message, state, trees, hearts, heart, back, count;

app.stage.interactive = true;

function setup() {
  game = new Container();
  app.stage.addChild(game)

//===========================Background=================================================

    back = new Sprite(resources["images/back.webp"].texture);
    back.width = 900;
    back.height = 512;
    game.addChild(back);

//=======================Create the player================================================

    player = new Sprite(resources["images/player.png"].texture);
    player.width = 50;
    player.height = 80;
    player.x = 68;
    player.y = 370;
    player.vx = 0;
    player.vy = 0;
    game.addChild(player);

    app.stage.on('pointerdown', onTouchStart);
    app.stage.on('pointerup', onTouchStop);


   function onTouchStart() {
     player.vy = -5;
     player.vx = 0;
    }
  function onTouchStop(){
    player.x = 68;
    player.y = 370;
    player.vy = 0;
  }

//====================Create tree ========================================================

    trees = [];
    let numberOfTrees = 50,
        spacing = 500,
        xOffset = 400,
        speed = 2,
        direction = -1;

    for (let i = 0; i < numberOfTrees; i++) {
      let tree = new Sprite(resources["images/tree.webp"].texture);
      tree.width = 60;
      tree.height = 100;
      tree.x = spacing * i + xOffset;
      tree.y = 340;

      tree.vx = speed * direction;
      trees.push(tree);
      game.addChild(tree);
    }
    
//======================================Heart=================================================

hearts = [];
let numberOfHearts = 50,
        spacing1 = 400,
        xOffset1 = 400,
        speed1 = 1,
        direction1 = -1.1;
for (let i = 0; i < numberOfHearts; i++) {
let heart = new Sprite(resources["images/heart.webp"].texture);
    heart.width = 50;
    heart.height = 90;
    heart.x = spacing1 * i + xOffset1;
    heart.y = Math.random() * 140;
    heart.vx = speed1 * direction1;
    hearts.push(heart);
    game.addChild(heart);
}

//==============================Health Bar=======================================================
    healthBar = new Container();
    healthBar.position.set(750, 28)
    game.addChild(healthBar);

    let innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    let outerBar = new Graphics();
    outerBar.beginFill(0xFF0000);
    outerBar.drawRect(0, 0, 128, 8);
    outerBar.endFill();

    healthBar.addChild(outerBar);
    healthBar.outer = outerBar;

//====================GameOver================================

    gameOver = new Container();
    app.stage.addChild(gameOver);

    gameOver.visible = false;

    let style = new TextStyle({
    fontFamily: "Comic Sans MS",
    fontSize: 64,
    fill: "white",
  }); 

    message = new Text("The End..", style);
    message.position.set(350, 230);
    gameOver.addChild(message);

    let style1 = new TextStyle({
      fontFamily: "Comic Sans MS",
      fontSize: 24,
      fill: "green",
    }); 

    message1 = new Text("Score: ", style1);
    message1.position.set(8, 8);
    game.addChild(message1);

//=====================================================================================

  state = play;
 
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));

  count = 0;

}

//========================================================================================

function gameLoop(delta){

  state(delta);

}

function play(delta) {

  player.x += player.vx;
  player.y += player.vy;

//=========================treeHit===================================

trees.forEach(function(tree) {
  tree.x += tree.vx;

  if(hitR(player, tree)) {
    tree.tint = 0xDC143C;
    healthBar.outer.width -= 0.3;
    player.tint = 0xff000;
    
  } else {
    player.alpha = 1;
    }
}
);

//===========================heartHit=================================

  hearts.forEach(function(heart) {
  heart.x += heart.vx;

  if(hitR(player, heart)) {
      count ++;
      heart.visible = false;
      message1.text = "Score: " + count + " / 300"
    }
  })

  if(count == 300){
    state = end;
    message.text = "You Win";
  }
  

  //======================HealthBar====================================

  if(healthBar.outer.width < 0 ){
    state = end;
    message.text = "Game Over";
  }
  
  function end(){
    game.visible = false;
    gameOver.visible =true;
  }

}