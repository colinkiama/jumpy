import Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    // In Phaser objects are position at their center-points (0,0 is at center of object)
    const player = this.add.rectangle(
      25,
      this.renderer.height - 50 / 2,
      50,
      50,
      0xff0000
    );

    const obstacle = this.add.rectangle(
      400,
      this.renderer.height - 100 / 2,
      200,
      100,
      0x00ff00
    );
  }
}
