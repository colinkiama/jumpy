import Phaser from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";

export default class Demo extends Phaser.Scene {
  sceneGlobals: {
    currentObstacle: Obstacle | undefined;
    currentPlayer: Player | undefined;
  } = {
    currentObstacle: undefined,
    currentPlayer: undefined,
  };

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    const player = new Player(this);
    const obstacle = new Obstacle(this);
    this.physics.add.existing(player.sprite);
    this.physics.add.existing(obstacle.sprite);
    obstacle.sprite.body.velocity.x = -100;
    this.sceneGlobals.currentObstacle = obstacle;
    this.sceneGlobals.currentPlayer = player;
  }

  update() {
    let massObjects = [
      this.sceneGlobals.currentObstacle,
      this.sceneGlobals.currentPlayer,
    ];

    massObjects.forEach((obj) => {
      if (obj === undefined) {
        return;
      }

      let obstacleBody = obj.sprite.body;

      if (obstacleBody.position.y >= this.renderer.height - obj.height) {
        obstacleBody.position.y = this.renderer.height - obj.height;
      }
    });
  }
}
