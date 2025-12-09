//****** GAME LOOP ********//
    var time = new Date();
    var deltaTime = 0;

    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(Init, 1);
    } else {
      document.addEventListener("DOMContentLoaded", Init);
    }

    function Init() {
      time = new Date();
      Start();
      Loop();
    }

    function Loop() {
      deltaTime = (new Date() - time) / 1000;
      time = new Date();
      Update();
      requestAnimationFrame(Loop);
    }

    //****** GAME LOGIC ********//
    var sueloY = 22;
    var velY = 0;
    var impulso = 900;
    var gravedad = 2500;

    var dinoPosX = 42;
    var dinoPosY = sueloY;

    var sueloX = 0;
    var velEscenario = 1280 / 3;
    var gameVel = 1;
    var score = 0;

    var parado = false;
    var saltando = false;

    var tiempoHastaObstaculo = 2;
    var tiempoObstaculoMin = 0.7;
    var tiempoObstaculoMax = 1.8;
    var obstaculoPosY = 16;
    var obstaculos = [];

    var tiempoHastaNube = 0.5;
    var tiempoNubeMin = 0.7;
    var tiempoNubeMax = 2.7;
    var maxNubeY = 270;
    var minNubeY = 100;
    var nubes = [];
    var velNube = 0.5;

    var contenedor;
    var dino;
    var textoScore;
    var suelo;
    var gameOver;

// Variables globales (ponlas junto con las demás al inicio del archivo)
var targetVel = 1; // velocidad objetivo
var highScore = 0;
var textoHighScore; // elemento visual del high score

function Start() {
  gameOver = document.querySelector(".game-over");
  suelo = document.querySelector(".suelo");
  contenedor = document.querySelector(".contenedor");
  textoScore = document.querySelector(".score");
  dino = document.querySelector(".dino");

  // Cargar high score desde localStorage
  highScore = parseInt(localStorage.getItem('dino_highscore') || '0', 10);

  // Crear/ubicar elemento visual del high score
  textoHighScore = document.querySelector('.highscore');
  if (!textoHighScore) {
    textoHighScore = document.createElement('div');
    textoHighScore.className = 'highscore';
    textoHighScore.textContent = 'HS: ' + highScore;
    contenedor.appendChild(textoHighScore);
  } else {
    textoHighScore.textContent = 'HS: ' + highScore;
  }

  document.addEventListener("keydown", HandleKeyDown);
  document.getElementById("btn-restart").addEventListener("click", ReiniciarJuego);
}

function Update() {
  if (parado) return;

  // acercar gameVel poco a poco al targetVel
  gameVel += (targetVel - gameVel) * 0.01;

  MoverDinosaurio();
  MoverSuelo();
  DecidirCrearObstaculos();
  DecidirCrearNubes();
  MoverObstaculos();
  MoverNubes();
  DetectarColision();

  velY -= gravedad * deltaTime;
}


    function HandleKeyDown(ev) {
  if (!parado && (ev.code === "Space" || ev.keyCode === 32)) {
    ev.preventDefault();
    Saltar();
  }
}
    function Saltar() {
  if (dinoPosY === sueloY) {
    saltando = true;
    velY = impulso;
    dino.classList.remove("dino-corriendo");
    try { sndSalto.currentTime = 0; sndSalto.play(); } catch(e){}
  }
}

    function MoverDinosaurio() {
      dinoPosY += velY * deltaTime;
      if (dinoPosY < sueloY) {
        TocarSuelo();
      }
      dino.style.bottom = dinoPosY + "px";
    }

    function TocarSuelo() {
      dinoPosY = sueloY;
      velY = 0;
      if (saltando) {
        dino.classList.add("dino-corriendo");
      }
      saltando = false;
    }

    function MoverSuelo() {
      sueloX += CalcularDesplazamiento();
      suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
    }

    function CalcularDesplazamiento() {
      return velEscenario * deltaTime * gameVel;
    }

    function Estrellarse() {
      dino.classList.remove("dino-corriendo");
      dino.classList.add("dino-estrellado");
      parado = true;
    }

    function DecidirCrearObstaculos() {
      tiempoHastaObstaculo -= deltaTime;
      if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
      }
    }

    function DecidirCrearNubes() {
      tiempoHastaNube -= deltaTime;
      if (tiempoHastaNube <= 0) {
        CrearNube();
      }
    }

    function CrearObstaculo() {
      var obstaculo = document.createElement("div");
      contenedor.appendChild(obstaculo);

      var tipos = ["cactus", "cactus2", "cono", "bidon"];
      var tipo = tipos[Math.floor(Math.random() * tipos.length)];
      obstaculo.classList.add(tipo);

      obstaculo.posX = contenedor.clientWidth;
      obstaculo.style.left = contenedor.clientWidth + "px";

      obstaculos.push(obstaculo);
      tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
    }

    function CrearNube() {
      var nube = document.createElement("div");
      contenedor.appendChild(nube);
      nube.classList.add("nube");
      nube.posX = contenedor.clientWidth;
      nube.style.left = contenedor.clientWidth + "px";
      nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

      nubes.push(nube);
      tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
    }

    function MoverObstaculos() {
      for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
          obstaculos[i].parentNode.removeChild(obstaculos[i]);
          obstaculos.splice(i, 1);
          GanarPuntos();
        } else {
          obstaculos[i].posX -= CalcularDesplazamiento();
          obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
      }
    }

    function MoverNubes() {
      for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
          nubes[i].parentNode.removeChild(nubes[i]);
          nubes.splice(i, 1);
        } else {
          nubes[i].posX -= CalcularDesplazamiento() * velNube;
          nubes[i].style.left = nubes[i].posX + "px";
        }
      }
    }

function GanarPuntos() {
  score++;
  textoScore.innerText = score;

  // actualizar high score si aplica
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('dino_highscore', String(highScore));
    if (textoHighScore) textoHighScore.textContent = 'HS: ' + highScore;
  }

  // definir velocidad objetivo y fondos
  if (score === 10) {
    targetVel = 1.0;
    contenedor.classList.remove('neon','ciudad');
    contenedor.classList.add('grafitti');
  } else if (score === 15) {
    targetVel = 1.5;
    contenedor.classList.remove('grafitti','ciudad');
    contenedor.classList.add('neon');
  } else if (score === 30) {
    targetVel = 2;
    contenedor.classList.remove('grafitti','neon');
    contenedor.classList.add('ciudad');
  }

  // el suelo se ajusta automáticamente porque gameVel se interpola
  suelo.style.animationDuration = (3 / gameVel) + "s";
}

    function GameOver() {
  Estrellarse();
  try { sndChoque.currentTime = 0; sndChoque.play(); } catch(e){}
  gameOver.style.display = "block";
  document.getElementById("btn-restart").style.display = "inline-block";
}

     // Audio
var sndSalto = new Audio('dinochivo/salt.mp3');
var sndChoque = new Audio('dinochivo/choque.mp3');

// Opcional: volumen y sin retardo
sndSalto.volume = 0.8;
sndChoque.volume = 0.9;
sndSalto.preload = 'auto';
sndChoque.preload = 'auto';

    function ReiniciarJuego() {
  parado = false;
  score = 0;
  textoScore.innerText = score;
  gameVel = 1;
  sueloX = 0;
  obstaculos = [];
  nubes = [];

  dino.classList.remove("dino-estrellado");
  dino.classList.add("dino-corriendo");
  gameOver.style.display = "none";
  document.getElementById("btn-restart").style.display = "none";

  document.querySelectorAll(".cactus, .cactus2, .cono, .bidon, .nube").forEach(el => el.remove());

  // Mantener fondo inicial si quieres:
  contenedor.classList.remove('grafitti','neon','ciudad');

  time = new Date();
}

    function DetectarColision() {
      for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
          break;
        } else {
          if (IsCollision(dino, obstaculos[i], 60, 60, 20, 30)) {
            GameOver();
          }
        }
      }
    }

    function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
      var aRect = a.getBoundingClientRect();
      var bRect = b.getBoundingClientRect();

      return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
      );
    }

