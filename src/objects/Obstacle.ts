import Phaser from "phaser";

const OBSTACLE_WIDTH = 100;
const OBSTACLE_HEIGHT = 80;
const OBSTACLE_COLOR = 0xff0000;

export default class Obstacle {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.width = OBSTACLE_WIDTH;
    this.height = OBSTACLE_HEIGHT;
    this.scene = scene;
    this.offsetX = this.scene.renderer.width + this.width * 2;
    this.offsetY = this.scene.renderer.height - this.height / 2;
    this.sprite = this.scene.add.rectangle(
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
      OBSTACLE_COLOR
    );
  }
}
