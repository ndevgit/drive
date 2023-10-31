console.log('js works');

const width = 800;
const height = 600;

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// запуск Phaser
const game = new Phaser.Game(config);
// /запуск Phaser

// переменные
let road;
let player;
let cursors;
let camera;
let enemy;
let music;
let score = 0;
let scoreText;
let gameOver;
let acceleration;
let brakes;
let engine;

// /переменные

function preload() {
  this.load.image('road', 'assets/road.png');
  this.load.image('car', 'assets/car.png');
  this.load.image('car-enemy', 'assets/car-enemy.png');
  this.load.audio('music', 'assets/music.mp3');
  this.load.audio('acceleration', 'assets/acceleration.mp3');
  this.load.audio('brakes', 'assets/brakes.mp3');
  this.load.audio('engine', 'assets/engine.mp3');
}

function create() {
  // дорога
  road = this.add.tileSprite(360, 600, 0, 0, 'road').setScale(0.5);
  // /дорога

  // игрок
  player = this.physics.add.sprite(400, 200, 'car').setScale(0.04);
  player.setSize(1900);
  player.setBounce(0);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(-200);

  this.physics.add.collider(player, road);
  // /игрок

  // добавление управления с клавиатуры
  cursors = this.input.keyboard.createCursorKeys();
  // /добавление управления с клавиатуры

  // враг
  enemy = this.physics.add.sprite(200, 200, 'car-enemy').setScale(0.04);
  enemy.setSize(1900);
  enemy.body.setGravityY(-200);
  enemy.setMaxVelocity(0, 600);

  this.physics.add.collider(player, enemy);
  // /враг

  // музыка
  music = this.sound.add('music', { volume: 0.1 });
  music.play();
  // /музыка

  // количество очков
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#FFF',
  });

  // /количество очков

  // авария
  this.physics.add.overlap(player, enemy, carHit, null, this);

  function carHit(player, enemy) {
    this.physics.pause();

    player.setTint(0xff0000);

    gameOver = this.add.text(450, 300, 'Game Over', {
      fontSize: '52px',
      fill: '#FF0000',
    });
    music.stop();
    engine.stop();
  }
  // /авария

  // количество очков
  function scoring() {
    score += 1;
    scoreText.setText('Score: ' + score);
  }

  setInterval(scoring, 1000);
  // /количество очков

  // звук ускорения
  acceleration = this.sound.add('acceleration', { volume: 0.005 });
  // /звук ускорения

  // звук тормозов
  brakes = this.sound.add('brakes', { volume: 0.005 });
  // /звук тормозов

  // звук двигателя
  engine = this.sound.add('engine', { volume: 0.005 });
  engine.setLoop(true);
  engine.play();
  // /звук двигателя
}

function update() {
  // назначение клавиш
  if (cursors.left.isDown) {
    player.setVelocityX(-300);
  } else if (cursors.right.isDown) {
    player.setVelocityX(300);
  } else {
    player.setVelocityX(5);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-150);
    this.cameras.main.shake(20, 0.01);
  } else {
    acceleration.play();
  }

  if (cursors.down.isDown) {
    player.setVelocityY(150);
  } else {
    brakes.play();
  }
  // /назначение клавиш

  // анимация дороги вверх
  road.tilePositionY += -50;
  // /анимация дороги вверх

  function getRandomX() {
    return Math.floor(Math.random() * 480);
  }

  if (enemy.y >= 700) {
    enemy.setY(-100);
    enemy.setX(getRandomX());
  }

  function scoringGas() {
    if (cursors.up.isDown) {
      score += 1;
      scoreText.setText('Score: ' + score);
    }
  }
  scoringGas();
}
