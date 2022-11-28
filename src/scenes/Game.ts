import Phaser from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";

export default class Demo extends Phaser.Scene {
  private hasObstacleCollidedWithPlayer: boolean = false;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private player!: Player;
  private obstacle!: Obstacle;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    this.player = new Player(this);
    this.obstacle = new Obstacle(this);
    this.physics.add.existing(this.player.sprite);
    this.physics.add.existing(this.obstacle.sprite);
    this.obstacle.sprite.body.velocity.x = -400;

    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    let massObjects = [this.obstacle, this.player];

    massObjects.forEach((obj) => {
      let objectBody = obj.sprite.body;

      // Prevent objects from falling out of
      if (objectBody.position.y > this.renderer.height - obj.height) {
        objectBody.position.y = this.renderer.height - obj.height;
      }
    });

    this.physics.collide(
      this.obstacle.sprite,
      this.player.sprite,
      this.playerHitObstacle
    );

    if (this.keySpace.isDown && this.player.isGrounded) {
      this.player.jump();
    }
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
