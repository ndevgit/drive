console.log('menuScene works');

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menuScene');

    this.startButton;
  }

  preload() {
    this.load.image('button', './assets/button.png');
  }

  create() {
    // this.add.text(300, 300, 'Press here to start...');
    this.startButton = this.add.sprite(400, 310, 'button');
    this.startButtonText = this.add.text(375, 305, 'START');

    this.startButton.setInteractive();
    this.startButton.on('pointerdown', () => this.scene.start('gameScene'));
  }
}
