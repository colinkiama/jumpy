import Phaser from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";
export default class Demo extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    const player = new Player(this);
    const obstacle = new Obstacle(this);
  }
}
