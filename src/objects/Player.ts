import Phaser from "phaser";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_COLOR = 0x00ff00;

export default class Player {
  private _width: number;
  private _height: number;
  private _scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Rectangle & Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;

  public get isGrounded() {
    return (
      this.sprite.body.position.y == this._scene.renderer.height - this._height
    );
  }

  constructor(scene: Phaser.Scene) {
    this._width = PLAYER_WIDTH;
    this._height = PLAYER_HEIGHT;
    this._scene = scene;
    let startingOffsetX = this._width / 2 + 50;
    let startingOffsetY = this._scene.renderer.height - this._height / 2;
    this.sprite = this._scene.add.rectangle(
      startingOffsetX,
      startingOffsetY,
      this._width,
      this._height,
      PLAYER_COLOR,
      0.5
    );
  }

  jump() {
    this.sprite.body.velocity.y = -1000;
  }
}
