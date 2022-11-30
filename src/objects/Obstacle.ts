import Phaser from "phaser";

const OBSTACLE_WIDTH = 100;
const OBSTACLE_HEIGHT = 80;
const OBSTACLE_COLOR = 0xff0000;

export default class Obstacle {
  private _width: number;
  private _height: number;
  private _offsetX: number;
  private _offsetY: number;
  private _scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this._width = OBSTACLE_WIDTH;
    this._height = OBSTACLE_HEIGHT;
    this._scene = scene;
    this._offsetX = this._scene.renderer.width + this._width * 2;
    this._offsetY = this._scene.renderer.height - this._height / 2;
    this.sprite = this._scene.add.rectangle(
      this._offsetX,
      this._offsetY,
      this._width,
      this._height,
      OBSTACLE_COLOR
    );
  }
}
