import Phaser from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";

export default class Demo extends Phaser.Scene {
  private hasObstacleCollidedWithPlayer: boolean = false;
  private sceneObjects!: {
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

    massObjects.forEach((obj) => {
      let obstacleBody = obj.sprite.body;

      // Prevent objects from falling out of
      if (obstacleBody.position.y >= this.renderer.height - obj.height) {
        obstacleBody.position.y = this.renderer.height - obj.height;
      }
    });

    this.physics.collide(
      this.sceneObjects.currentObstacle.sprite,
      this.sceneObjects.currentPlayer.sprite,
      this.playerHitObstacle
    );
  }

  playerHitObstacle(
    obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    if (!this.hasObstacleCollidedWithPlayer) {
      this.hasObstacleCollidedWithPlayer = true;
      console.log("Obstacle hit detected");
    }
  }
}
