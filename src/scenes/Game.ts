import Phaser from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";

export default class Demo extends Phaser.Scene {
  sceneObjects!: {
    currentObstacle: Obstacle;
    currentPlayer: Player;
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

    this.sceneObjects = {
      currentObstacle: obstacle,
      currentPlayer: player,
    };
  }

  update() {
    let massObjects = [
      this.sceneObjects.currentObstacle,
      this.sceneObjects.currentPlayer,
    ];

    // TODO: Add collision detection via this example: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Collision_detection#brickball_collision_detection

    massObjects.forEach((obj) => {
      let obstacleBody = obj.sprite.body;

      // Prevent objects from falling out of
      if (obstacleBody.position.y >= this.renderer.height - obj.height) {
        obstacleBody.position.y = this.renderer.height - obj.height;
      }
    });
  }
}
