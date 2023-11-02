console.log('gameOverScene works');

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameOverScene');

    this.restartButton;
  }

  preload() {
    this.load.image('button', './assets/button.png');
  }

  create() {
    this.gameOver = this.add.text(270, 150, 'Game Over', {
      fontSize: '52px',
      fill: '#FF0000',
    });

    this.restartButton = this.add.image(400, 310, 'button');
    this.restartButtonText = this.add.text(370, 305, 'RESTART');

    this.restartButton.setInteractive();
    this.restartButton.on('pointerdown', () => this.scene.start('gameScene'));
  }
}
