console.log('gameScene works');

export class GameScene extends Phaser.Scene {
  constructor() {
    super('gameScene');

    // переменные
    this.road;
    this.player;
    this.cursors;
    this.camera;
    this.enemy;
    this.music;
    this.score = 0;
    this.scoreText;
    this.gameOver;
    this.acceleration;
    this.brakes;
    this.engine;
    this.disableSound;
    this.pause;
    this.enemies;
    this.headlight;
    this.rearlight;

    this.headlightEnemy;
    this.rearlightEnemy;

    // /переменные
  }

  preload() {
    this.load.image('road', 'assets/road.png');
    this.load.image('car', 'assets/car.png');
    this.load.image('car-enemy', 'assets/car-enemy.png');
    this.load.audio('music', 'assets/music.mp3');
    this.load.audio('acceleration', 'assets/acceleration.mp3');
    this.load.audio('brakes', 'assets/brakes.mp3');
    this.load.audio('engine', 'assets/engine.mp3');
    this.load.image('light', 'assets/light.png');
  }

  create() {
    /*дорога*/
    this.road = this.add.tileSprite(400, 600, 0, 0, 'road').setScale(0.1, 0.5);

    /*игрок*/
    this.player = this.physics.add.sprite(400, 200, 'car').setScale(0.04);
    this.player.setSize(1900, 4200);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    // this.player.body.setGravityY(-200);
    /*физика*/
    this.physics.add.collider(this.player, this.road);

    //==========УПРАВЛЕНИЕ==========//
    /*добавление управления с клавиатуры*/
    this.cursors = this.input.keyboard.createCursorKeys();
    //==========/УПРАВЛЕНИЕ==========//

    /*враг*/
    this.enemy = this.physics.add.sprite(200, 200, 'car-enemy').setScale(0.04);
    this.enemy.setSize(1900, 4200);
    // this.enemy.body.setGravityY(-200);
    this.enemy.setMaxVelocity(0, 600);
    /*физика*/
    this.physics.add.collider(this.player, this.enemy);

    //==========ЗВУК==========//
    /*музыка*/
    this.music = this.sound.add('music', { volume: 0.1 }).setLoop(true);
    this.music.play();

    /*звук ускорения*/
    this.acceleration = this.sound.add('acceleration', { volume: 0.005 });

    /*звук тормозов*/
    this.brakes = this.sound.add('brakes', { volume: 0.005 });

    /*звук двигателя*/
    this.engine = this.sound.add('engine', { volume: 0.005 });
    this.engine.setLoop(true);
    this.engine.play();
    //==========/ЗВУК==========//

    //==========ИНТЕРФЕЙС==========//
    /*количество очков*/
    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {
      fontSize: '32px',
      fill: '#FFF',
    });

    /*выключить звук*/
    this.disableSound = this.add.text(716, 16, 'SOUND');
    this.disableSound.setInteractive();
    this.disableSound.on('pointerdown', () => this.music.stop());

    /*авария*/
    this.physics.add.overlap(this.player, this.enemy, carHit, null, this);

    function carHit(player, enemy) {
      this.scene.stop();
      this.player.setTint(0xff0000);
      this.music.stop();
      this.engine.stop();
      this.acceleration.stop();
      this.brakes.stop();
      this.scene.start('gameOverScene');
    }
    //==========/ИНТЕРФЕЙС==========//

    /*фары*/
    /*включение модуля освещения*/
    this.lights.enable();
    // this.lights = this.lights
    //   .addLight(this.player.y)
    //   .setIntensity(5)
    //   .setRadius(200);

    this.headlight = this.lights
      .addLight(this.player.y)
      .setIntensity(5)
      .setRadius(200);

    this.road.setPipeline('Light2D');
    this.enemy.setPipeline('Light2D');
    this.player.setPipeline('Light2D');

    this.rearlight = this.lights
      .addLight(this.player.y)
      .setIntensity(1)
      .setRadius(50)
      .setColor(0xff0000);

    this.headlightEnemy = this.lights
      .addLight(this.enemy.y)
      .setIntensity(5)
      .setRadius(200);

    this.rearlightEnemy = this.lights
      .addLight(this.enemy.y)
      .setIntensity(1)
      .setRadius(50)
      .setColor(0xff0000);
    /*/фары*/
  }

  update() {
    //==========НАЗНАЧЕНИЕ КЛАВИШ==========//
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
      this.player.setAngle(-30);
      this.player.setSize(1000, 4000);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
      this.player.setAngle(30);
      this.player.setSize(1000, 4000);
    } else {
      this.player.setVelocityX(5);
      this.player.setAngle(0);
      this.player.setSize(1900, 4200);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-150);
      this.cameras.main.shake(20, 0.01);

      /*увеличение очков*/
      this.score += 1;
      this.scoreText.setText('Score: ' + this.score);
    } else {
      /*звук ускорения*/
      this.acceleration.play();
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(150);
      this.cameras.main.setZoom(1.01);
    } else {
      this.brakes.play();
      this.cameras.main.setZoom(1);
    }
    //==========/НАЗНАЧЕНИЕ КЛАВИШ==========//

    /*анимация дороги вверх*/
    this.road.tilePositionY += -50;
    /*/анимация дороги вверх*/

    /*рандомное появление врага*/
    function getRandomX() {
      return Math.floor(Math.random() * 600);
    }

    if (this.enemy.y >= 700) {
      this.enemy.setY(-100);
      this.enemy.setX(getRandomX());
    }
    /*/рандомное появление врага*/

    /*отслеживание фар*/
    this.headlight.x = this.player.x;
    this.headlight.y = this.player.y - 150;

    this.rearlight.x = this.player.x;
    this.rearlight.y = this.player.y + 100;

    this.headlightEnemy.x = this.enemy.x;
    this.headlightEnemy.y = this.enemy.y - 150;

    this.rearlightEnemy.x = this.enemy.x;
    this.rearlightEnemy.y = this.enemy.y + 100;
    /*/отслеживание фар*/
  }
}
