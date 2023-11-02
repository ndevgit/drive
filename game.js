console.log('js works');

import { MenuScene } from './menuScene.js';
import { GameScene } from './gameScene.js';
import { GameOverScene } from './gameOverScene.js';

const width = 800;
const height = 600;

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [MenuScene, GameScene, GameOverScene],
};

// запуск Phaser
const game = new Phaser.Game(config);
// /запуск Phaser
