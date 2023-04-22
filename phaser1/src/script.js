
//config
let config={
    type:Phaser.AUTO,
    width:800,
    heigth:600, 

    scene:{
        preload:preload,
        create:create,
        update:update
    }
,
      physics: {
    default: 'arcade',  //hay varios modos arcade es uno
    arcade: {
      gravity: { y:300 },
      debug: false
    }
  } 
}

let score=0;
let scoreText;
let gameover=false;


//config
let game=new Phaser.Game(config);

//game preload
function preload(){
this.load.image ('sky','assets/sky.png')
this.load.image ('ground','assets/platform.png')
this.load.image ('star','assets/star.png')
this.load.image ('bomb','assets/bomb.png')
                                               //ancho          //alto   
this.load.spritesheet('dude','assets/dude.png',{frameWidth:32 ,frameHeight:48})
}





//CREATE

function create()
{

//nota el orden de creacion debe ser pensado    
//this.add.image(x,y,nombre)
this.add.image(400,300,'sky');

//ahora creamos una nueva plataforma con grupo estatico
 platforms=this.physics.add.staticGroup();
 //el scale trabaja las escalas de la foto
                 //x,y 
 platforms.create(400,568,'ground').setScale(2).refreshBody(); //piso
 platforms.create(600,380,'ground');
 platforms.create(50,250,'ground');
 platforms.create(750,220,'ground');

 //personaje principal
                               //x,y  
 player=this.physics.add.sprite(200,250,'dude');

 player.setCollideWorldBounds(true);
 player.setBounce(0.2);

 this.anims.create(
{
    
    key:'left',
    frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
    frameRete:10, //velociadf de 10 fotoramas por sg
    repeat:-1 // con-1 le indicamos que debe volver a comenzar cuando termine
});

 this.anims.create(
{
    
    key:'turn',
    frames: [{key:'dude',frame:4}], 
    frameRete:20, //velociadf de 10 fotoramas por sg
   
});

 this.anims.create(
{
    
    key:'right',
    frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
    frameRete:10, //velociadf de 10 fotoramas por sg
    repeat:-1 // con-1 le indicamos que debe volver a comenzar cuando termine
})

//

player.body.setGravityY(9); // lo anule para que pueda saltar alto
this.physics.add.collider(player,platforms);//que colicione con la platforms

//manjejo de teclado

cursors=this.input.keyboard.createCursorKeys();


//grupo dinamico con estrellas
stars=this.physics.add.group(
    {

     key:'star',
     repeat:11, //repito 11 estrellas ,
     setXY:{x:12,y:0 ,stepX:70}   //step separa los grupos de estrellas
    });

      stars.children.iterate(function(child)
      {
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
      });


      this.physics.add.collider(stars,platforms);  //collision estrella plataforma
     
     //
     this.physics.add.overlap(player,stars,collectStar,null,true);
      scoreText=this.add.text(16,16,'score:0', {fontSize:'20px',fill:'#000'} );  //el score
    // grupo dinámico con bombas
         bombs = this.physics.add.group();
   
        // hacer que las bombas colisionen con las plataformas
       // this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(bombs, platforms, function(bomb, platform) {
         //bomb.setVelocity(Phaser.Math.Between(-200,200), 20);
         bomb.setBounceY(1);
        });
    

        this.physics.add.collider(player,bombs,hitbomb,null,this);
    }





//UPDATE

function update()
{


  if(gameover)
  {
    return
  }  


//cursores  
if(cursors.right.isDown) {
     player.setVelocityX(160);
    player.anims.play('right',true);
   }

   else if(cursors.left.isDown)
   {
    player.setVelocityX(-160);
    player.anims.play('left',true);
   }
   else{
    player.setVelocityX(0);
    player.anims.play('turn');
   }

   if(cursors.up.isDown && player.body.touching.down){
    player.setVelocityY(-330);
   }
}






function collectStar(player,star)
{
    star.disableBody(true,true);
    score+=10; //incrementa en 10 cada estrella
    scoreText.setText('score:'+score)


   if(stars.countActive(true)===0)
   {
    stars.children.iterate(function(child)
      {
        child.enableBody(true,child.x,0,true,true);
      });
    }
 //recien cuando termina agrega una bomba

          //distancia al jugador para lanzar la bomba
   let x=(player.x <400) ? Phaser.Math.Between(400,800):Phaser.Math.Between(0,400);
   let bomb=bombs.create(x,16,'bomb');

   bomb.setBounceY(1);  // Agregamos esta línea para hacer que las bombas reboten siempre.
    
   bomb.setCollideWorldBounds(true);
   bomb.setVelocity(Phaser.Math.Between(-200,200),20); 
  
}


function hitbomb()
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameover=true;
}