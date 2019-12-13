var juego = new Phaser.Game(960, 600, Phaser.AUTO, '',
{ preload: preload, create: create, update: update });

//CONSTANTES
const Gravedad = 1200;
const StringNumeros = "0123456789* ";

//VARIABLES
var plataformas;
var cursores;
var jugadorM;
var mazorcasM;
var fueguitos;
var gatitos;
var paredes;
var velocidadEnemigo = 100;
var puerta;
var barraDeEspacio;
var objetivo;
var jugadorStats =
{
  vidas : 5,
  salto : 530,
  velocidad : 170,
  puntaje : 0,
  jugadorTieneLlave : false
}
var decor;

//aux
var aux = true;
var aux1 = true;
var interruptor = true;

//variables interfaz grafica
var hud;
var puntajeFuente;
var iconoPickup;
var imagenPuntaje;
var vidasFuente;
var iconoVidas;
var imagenVidas;
var iconoLlave;
var juegoFuente;
var imagenJuego;
var texto;
var imagenF;

//variables sonidos
var sFondo;
var sFuego;
var sGanar;
var sGatito;
var sMoneda;
var sPuerta;
var sSaltar;
var sPerdiste;

//variables de botones
var btnLeft;
var btnRight;
var btnJump;
var movRight;
var movLeft;
var playmusic;
var pausemusic;

function preload()
{
  //adaptar a la pantalla
  juego.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  //escalar
  juego.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  // juego.scale.pageAlignHorizontal = true;
  // juego.scale.pageAlignVertical = true;

  //imagenes
  juego.load.image('fondo', 'img/fondo.png');
  juego.load.image("iconoVidas","img/iconoJugadoraF.png");
  juego.load.image("numeros","img/numeros.png");
  juego.load.image("iconoPickup","img/iconoPickup.png");
  juego.load.image("loser","img/perdiste.png");
  juego.load.image("decor","img/decor.png");

  //spritesheet
  juego.load.spritesheet("fuego", "img/fuego.png", 34, 52);
  juego.load.spritesheet('mazorcaM', 'img/mazorcaM.png', 33, 38);
  juego.load.spritesheet('jugadoraM', 'img/jugadoraM.png', 33, 49);
  juego.load.spritesheet('gatito', 'img/gatito.png', 63, 33);
  juego.load.spritesheet("puerta", "img/puerta.png",40,66);
  juego.load.spritesheet("iconoLlave", "img/iconoLlave.png",52,39);
  juego.load.spritesheet("objetivo", "img/objetivo.png",64,61);
  juego.load.spritesheet("btnLeft", "img/btnLeft.png",120,120);
  juego.load.spritesheet("btnRight", "img/btnRight.png",120,120);
  juego.load.spritesheet("btnJump", "img/btnJump.png",120,120);
  juego.load.spritesheet("play", "img/play.png",120,120);
  juego.load.spritesheet("pause", "img/pause.png",120,120);

  //paredes
  juego.load.image('plataforma_1x1', 'img/plataforma_1x1.png');
  juego.load.image('plataforma_2x1', 'img/plataforma_2x1.png');
  juego.load.image('plataforma_4x1', 'img/plataforma_4x1.png');
  juego.load.image('plataforma_6x1', 'img/plataforma_6x1.png');
  juego.load.image('plataforma_8x1', 'img/plataforma_8x1.png');
  juego.load.image('paredInvisible', 'img/pared_invisible1.png');
  juego.load.image('piso', 'img/piso.png');

  //sonidos
  juego.load.audio("fondo","sonidos/fondo1.mp3");
  juego.load.audio("saltar","sonidos/saltar.wav");
  juego.load.audio("ganar","sonidos/ganar.mp3");
  juego.load.audio("puerta","sonidos/puerta.mp3");
  juego.load.audio("fuego","sonidos/fuego.wav");
  juego.load.audio("gatito","sonidos/gatito.wav");
  juego.load.audio("moneda","sonidos/moneda.wav");
  juego.load.audio("perdiste","sonidos/perdiste.mp3");
}

function create()
{
  //Activamos las físicas en el juego
  juego.physics.startSystem(Phaser.Physics.ARCADE);

  //le da valor a la gravedad
  juego.physics.arcade.gravity.y = Gravedad;

  //objetos estaticos
  juego.add.sprite(0, 0, 'fondo');

  //grupos
  decor = juego.add.group();
  hud = juego.add.group();
  plataformas = juego.add.group();
  mazorcasM = juego.add.group();
  fueguitos = juego.add.group();
  gatitos = juego.add.group();
  paredes = juego.add.group();

  if (screen.width < 1024){
    // create our virtual game controller buttons 
    //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnJump = juego.add.button(850, 420, 'btnJump', null, this, 0, 1, 0, 1);
      //our buttons should stay on the same place  
    btnJump.fixedToCamera = true;
    btnJump.alpha = 0.4;

    btnJump2 = juego.add.button(50, 420, 'btnJump', null, this, 0, 1, 0, 1);
      //our buttons should stay on the same place  
    btnJump2.fixedToCamera = true;
    btnJump2.alpha = 0.4;

    btnRight = juego.add.button(850, 510, 'btnRight', null, this, 0, 1, 0, 1);
    btnRight.fixedToCamera = true;
    btnRight.alpha = 0.4;
    //movimiento con viartual controller
    btnRight.events.onInputDown.add(function(){movRight=true});
    btnRight.events.onInputUp.add(function(){movRight=false});

    btnLeft = juego.add.button(50, 510, 'btnLeft', null, this, 0, 1, 0, 1);
    btnLeft.fixedToCamera = true;
    btnLeft.alpha = 0.4;
    btnLeft.events.onInputDown.add(function(){movLeft=true});
    btnLeft.events.onInputUp.add(function(){movLeft=false}); 
  }

  playmusic = juego.add.button(10, 60, 'play', null, this, 0, 1, 0, 1);
  playmusic.alpha = 0.8;
  playmusic.fixedToCamera = true;
  playmusic.events.onInputDown.add(function(){
    sFondo.play();
    playmusic.visible = false
    pausemusic.visible = true
  });

  pausemusic = juego.add.button(10, 60, 'pause', null, this, 0, 1, 0, 1);
  pausemusic.events.onInputDown.add(function(){
    sFondo.stop();
    playmusic.visible = true
    pausemusic.visible = false
  });
  pausemusic.fixedToCamera = true;
  pausemusic.alpha = 0.8;

  playmusic.visible = false
  pausemusic.visible = true
  //crear objetos
    //Inicializo la tecla de barra de espacio
    barraDeEspacio = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //barraDeEspacio.onDown.add(saltador, this);

    //objetos moviles
    jugadorM = juego.add.sprite(20, 500, 'jugadoraM');

    //agregar funcionalidad a las teclas de flechas
    cursores = juego.input.keyboard.createCursorKeys();

    //sonidos
    sFondo = juego.add.audio("fondo");
      sFondo.play();
      sFondo.loop = true;
      sFondo.volume  = 0.5;
    sPerdiste = juego.add.audio("perdiste");
    sFuego = juego.add.audio("fuego");//
    sGanar = juego.add.audio("ganar");
    sGatito = juego.add.audio("gatito");//
    sMoneda = juego.add.audio("moneda");//
    sPuerta = juego.add.audio("puerta");
    sSaltar = juego.add.audio("saltar");//
    //objetos estaticos
    objetivo = juego.add.sprite(890,45,"objetivo");
    imagenF = juego.add.sprite(0, 0, 'loser');
      imagenF.visible = false;
    puerta = juego.add.sprite(20, 150,"puerta");
    juego.physics.arcade.enable(puerta);
    FijarEnLugar(puerta);
      puerta.anchor.set(0.5,0.5);

    //activar fisicas
    plataformas.enableBody = true;
    mazorcasM.enableBody = true;
    fueguitos.enableBody = true;
    gatitos.enableBody = true;
    paredes.enableBody  = true;
      paredes.visible = false;
    juego.physics.arcade.enable(jugadorM);
      jugadorM.anchor.set(0.5, 0.5);
    juego.physics.arcade.enable(objetivo);
      objetivo.anchor.set(0.5,0.5);
      FijarEnLugar(objetivo);

    //colisiones
    //el jugador colisiona con los bordes del canvas
    jugadorM.body.collideWorldBounds = true;

    //interfaz grafica
        //TEXTOS
        hud.position.set(0, 0);

        puntajeFuente  = juego.add.retroFont('numeros', 20, 26, StringNumeros, 6);
        vidasFuente = juego.add.retroFont('numeros', 20, 26, StringNumeros, 6);

        iconoLlave = hud.create(60, 10, 'iconoLlave');
        iconoLlave.scale.x = -1;
        iconoLlave.animations.add('vacaV', [1]);

        iconoPickup = hud.create(90, 30, 'iconoPickup');
        iconoPickup.scale.x = -1;
        iconoPickup.anchor.set(0.5,0.5);
        imagenPuntaje = hud.create(145, 30, puntajeFuente);
        puntajeFuente.text = "*0";
        imagenPuntaje.anchor.set(0.5,0.5);

        iconoVidas = hud.create(90, 80, 'iconoVidas');
        iconoVidas.scale.x = -1;
        iconoVidas.anchor.set(0.5,0.5);
        imagenVidas = hud.create(145, 80, vidasFuente);
        vidasFuente.text = "*"+jugadorStats.vidas;
        imagenVidas.anchor.set(0.5,0.5);

        texto = juego.add.text(500, 315, '', { fontSize: '42px', fill: '#e5d107', strokeThickness: 2.5, stroke: '#FFFFFF'});
        texto.anchor.set(0.5,0.5);
        texto.text = "consigue las primeras 16 mazorcas";

    //decor
    decor.create(50,490,"decor");
    decor.create(475,490,"decor");
    decor.create(170,225,"decor");

    //gatitos
    //*agregar gatitos en plataformas del mismo tamaño para que no se bugeen
    gatitos.create(200,425.5,"gatito");
    gatitos.create(600,535.5,"gatito");
    gatitos.create(335,265.5,"gatito");
    gatitos.create(600,425.5,"gatito");
    gatitos.create(724,265.5,"gatito");
    gatitos.create(535,265.5,"gatito");

    //fueguitos
    //condicion desaparecer
    fueguitos.create(840,50,"fuego");//fuego objetivo
    fueguitos.create(870,535,"fuego");
    fueguitos.create(840,535,"fuego");
    fueguitos.create(345,535.5,"fuego");
    fueguitos.create(439,535.5,"fuego");
    //fuego normales
    fueguitos.create(437,300,"fuego");
    fueguitos.create(633,300,"fuego");
    fueguitos.create(550,130,"fuego");

    //mazorcasM
    mazorcasM.create(33,425.5, "mazorcaM");
    mazorcasM.create(392,425.5, "mazorcaM");
    mazorcasM.create(392,535.5, "mazorcaM");
    mazorcasM.create(925,535.5, "mazorcaM");
    mazorcasM.create(925,425.5, "mazorcaM");
    mazorcasM.create(530,125, "mazorcaM");
    mazorcasM.create(570,125, "mazorcaM");
    mazorcasM.create(297,265.5, "mazorcaM");
    mazorcasM.create(400,265.5, "mazorcaM");
    mazorcasM.create(487,265.5, "mazorcaM");
    mazorcasM.create(592,265.5, "mazorcaM");
    mazorcasM.create(680,265.5, "mazorcaM");
    mazorcasM.create(810,265.5, "mazorcaM");
    mazorcasM.create(606,425.5, "mazorcaM");
    mazorcasM.create(600,535.5, "mazorcaM");
    mazorcasM.create(240,35.5, "mazorcaM");
    mazorcasM.create(681,95.5, "mazorcaM");
    mazorcasM.create(391,95.5, "mazorcaM");

    //paredes paredInvisible
    plataformas.create(50, 280, 'plataforma_1x1');
      plataformas.children[0].kill();
    plataformas.create(130, 40, 'plataforma_1x1');
    plataformas.create(130, 100, 'plataforma_1x1');
    plataformas.create(130, 150, 'plataforma_1x1');
    plataformas.create(130, 200, 'plataforma_1x1');
    //plataformas
    plataformas.create(0, 560, 'piso');
    //1x1
    plataformas.create(0, 180, 'plataforma_1x1');
    plataformas.create(370, 450, 'plataforma_1x1');
    plataformas.create(900, 450, 'plataforma_1x1');
    plataformas.create(220, 60, 'plataforma_1x1');
    plataformas.create(915, 340, 'plataforma_1x1');//750 a 920x

    //2x1
    plataformas.create(845, 75, 'plataforma_2x1');

    //4x1
    plataformas.create(600, 120, 'plataforma_4x1');
    plataformas.create(330, 120, 'plataforma_4x1');
    plataformas.create(650, 290, 'plataforma_4x1');
    plataformas.create(450, 290, 'plataforma_4x1');
    plataformas.create(180, 290, 'plataforma_6x1');
    plataformas.create(530, 450, 'plataforma_4x1');

    plataformas.create(5, 450, 'plataforma_6x1');
    plataformas.create(480, 560, 'plataforma_8x1');

    //recorre el array de los grupos y va fijando cada hijo segun la funcion
    for (aux of plataformas.children)
    {
      FijarEnLugar(aux);
      crearParedInvisible(aux.x,aux.y,"izq");
      crearParedInvisible(aux.x + aux.width, aux.y,"der");
    }

    for (aux of mazorcasM.children)
    {
      FijarEnLugar(aux);
      aux.anchor.set(0.5, 0.5);
      //crear animacion de rotar
      aux.animations.add('rotar', [0, 1, 2, 3], 6, true);
      //reproducir animacion de rotar
      aux.animations.play("rotar");
    }

    for (aux of fueguitos.children)
    {
        FijarEnLugar(aux);
        aux.anchor.set(0.5, 0.5);
        //crear animacion de rotar
        aux.animations.add('ocioso', [0, 1, 2], 6, true);
        //reproducir animacion de rotar
        aux.animations.play("ocioso");
    }

    for (aux of gatitos.children)
    {
      aux.anchor.set(0.5, 0.5);
      aux.animations.add('mover', [1, 2], 3, true);
      aux.animations.add('morir', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3,3,3,3], 14);
      aux.animations.play("mover");
      aux.body.velocity.x = velocidadEnemigo;
      aux.body.collideWorldBounds = true;
    }

    ocultarparedes();

    //creacion de animaciones
    puerta.animations.add("abrir",[1]);
    objetivo.animations.add('ocioso', [0, 1], 2, true);
      objetivo.animations.play("ocioso");
    jugadorM.animations.add('correr', [1, 2], 8, true);
    jugadorM.animations.add('saltar', [3],1);
    jugadorM.animations.add('caer', [4]);
    jugadorM.animations.add('ocioso', [0]);

    cursores.up.onDown.add(saltador,this);
    btnJump.events.onInputOver.add(function(){saltador()});
    btnJump.events.onInputDown.add(function(){saltador()});
    btnJump2.events.onInputOver.add(function(){saltador()});
    btnJump2.events.onInputDown.add(function(){saltador()});
}

function update()
{
  //Detecta la colision entre dos objetos
  juego.physics.arcade.collide(jugadorM, plataformas);
  juego.physics.arcade.overlap(jugadorM, mazorcasM, jugadorConPickup);
  juego.physics.arcade.overlap(jugadorM, fueguitos, matarJugador);
  juego.physics.arcade.collide(gatitos, plataformas);
  juego.physics.arcade.collide(gatitos, paredes, girarGato);
  juego.physics.arcade.collide(jugadorM, gatitos, jugadorConEnemigo);
  juego.physics.arcade.collide(plataformas, gatitos);
  juego.physics.arcade.overlap(jugadorM, puerta, ganaste);
  juego.physics.arcade.overlap(jugadorM, objetivo, JugadorConObjetivo);


  //movimiento del jugador
  if(cursores.right.isDown || movRight)
  {
    Mover(1);
  }else if(cursores.left.isDown || movLeft)
    {
      Mover(-1);
    }else
      {
        ocioso()
      }
  if(jugadorM.body.velocity.x != 0)
  {
    jugadorM.animations.play('correr');
  }
  if(jugadorM.body.velocity.y < 0)
  {
    jugadorM.animations.play('saltar');
  }else if(jugadorM.body.velocity.y > 0){
    jugadorM.animations.play('caer');
  }
}

function ocioso()
{
  jugadorM.animations.play('ocioso');
  jugadorM.body.velocity.x = 0;
}

//funciones propias del juego
function jugadorConEnemigo(jugador , enemigo)
{
  if(jugadorM.body.velocity.y > 0)
  {
    let saltotemporal = jugadorStats.salto;
    jugadorStats.salto = saltotemporal + 50;
    saltador();
    jugadorStats.salto = saltotemporal;
    //ejecuta una funcion al terminar una animacion
    var muerteE = enemigo.animations.play("morir");
    muerteE.onComplete.addOnce(function(){enemigo.kill()});
  }else {
    aux = false;
    matarJugador();
    sGatito.play();
    aux = true;
  }
}

function jugadorConPickup (jugador, pickup)
{
  if(aux1)
  {
    setTimeout(function(){texto.text = "los tigres te ayudan a saltar"}, 100);
    setTimeout(function(){texto.text = ""}, 6000);
    aux1 = false;
  }
  pickup.kill();
  sMoneda.play();
  jugadorStats.puntaje++;
  puntajeFuente.text = "*"+jugadorStats.puntaje;
  if(jugadorStats.puntaje == 16)
  {
    matarfuegos();
    texto.text = "faltan 2 mazorcas";
  }else if(jugadorStats.puntaje == 18){
    texto.text = "salva a la vaca";
    fueguitos.children[0].kill();
    revivirgatos(6);
  }
}

function JugadorConObjetivo(jugador, objetivo)
{
  plataformas.children[0].revive();
  texto.text = "ahora ve hacia la puerta";
  objetivo.kill();
  jugadorStats.jugadorTieneLlave = true;
  sPuerta.play();
  puerta.animations.play("abrir");
  iconoLlave.animations.play('vacaV');
}

function crearParedInvisible(x,y,lado)
{
  var pared = paredes.create(x,y,"paredInvisible");
  pared.anchor.set(lado == "izq" ? 1: 0, 1);
  FijarEnLugar(pared);
}

function matarJugador()
{
  jugadorM.body.velocity.y  =0;
  jugadorStats.vidas--;
  vidasFuente.text = "*"+jugadorStats.vidas;
  if(aux)sFuego.play();
  if(jugadorStats.vidas > 0)
  {
    jugadorM.position.set(20,530)
    revivirgatos(3);
  }else{
    gameOver();
    //espera un tiempo para ejecutar una funcion
    setTimeout(function(){reiniciar()}, 6000);
  }
}
function matarfuegos()
{
  for (var i = 1; i < 5; i++)
  {
    fueguitos.children[i].kill();
  }
}

function gameOver()
{
  decor.visible = false;
  texto.text = "";
  jugadorM.kill();
  sFondo.stop();
  sPerdiste.play();
  for (aux of plataformas.children)
  {
    //le quitamos el movimiento al cuerpo del objeto
    aux.body.moves = true;
    //Lo hacemos inamovible
    aux.body.immovable = false;
  }
  imagenF.visible = true;
  puerta.visible = false;
}

function reiniciar()
{
  jugadorStats.vidas = 5;
  jugadorStats.puntaje = 0;
  sGanar.stop();
  juego.state.restart();
}

function ocultarparedes()
{
  for (var i = 0; i < 5; i++) {
    plataformas.children[i].visible = false;
  }
}

function revivirgatos(contador)
{//.position.set(20,500);
  for (var i = 0; i < contador; i++) {
    gatitos.children[i].revive();
    gatitos.children[i].animations.play("mover");
  }
}

function ganaste()
{
  if(!aux1)sGanar.play();
  if(jugadorStats.jugadorTieneLlave)
  {
    sFondo.stop();
    texto.text = "mission complete";
    jugadorM.kill();
    setTimeout(function(){reiniciar()}, 4000);
  }
}

function saltador()
{
  //jugadorM.body.velocity.y = -jugadorStats.salto;
  if (jugadorM.body.touching.down)
  {
    sSaltar.play();
    jugadorM.body.velocity.y = -jugadorStats.salto;
  }
}

function Mover(direccion)
{
  jugadorM.body.velocity.x = jugadorStats.velocidad * direccion;
  jugadorM.scale.x = direccion;
}

function FijarEnLugar(objeto)
{
  //le quitamos el movimiento al cuerpo del objeto
  objeto.body.moves = false;
  //Lo hacemos inamovible
  objeto.body.immovable = true;
}

function girarGato(gatito,parede)
{
  interruptor = !interruptor;
  if(interruptor)
  {
    gatito.scale.x = 1;
    velocidadEnemigo = velocidadEnemigo * -1;
  }else {
    gatito.scale.x = -1;
    velocidadEnemigo = velocidadEnemigo * -1;
  }
  gatito.body.velocity.x = velocidadEnemigo;
}
