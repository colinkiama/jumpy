import Phaser from "phaser";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_COLOR = 0x00ff00;

export default class Player {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Rectangle;

  public get isGrounded() {
    return (
      this.sprite.body.position.y == this.scene.renderer.height - this.height
    );
  }

  constructor(scene: Phaser.Scene) {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.scene = scene;
    this.offsetX = this.width / 2 + 50;
    this.offsetY = this.scene.renderer.height - this.height / 2;
    this.sprite = this.scene.add.rectangle(
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
      PLAYER_COLOR
    );
  }

  jump() {
    this.sprite.body.velocity.y = -1000;
  }
}
