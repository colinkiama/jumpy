import Phaser, { Tilemaps } from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";

export default class Demo extends Phaser.Scene {
  private hasObstacleCollidedWithPlayer: boolean = false;
  private score: number = 0;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private player!: Player;
  private obstacle!: Obstacle;
  private checkpointLine!: Phaser.GameObjects.Line;

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

    let thresholdDistance = 10;
    let checkpointX =
      this.player.width - thresholdDistance - this.obstacle.width;

    // let checkpointX = 400;
    this.checkpointLine = this.add.line(
      checkpointX,
      this.renderer.height / 2,
      checkpointX,
      0,
      checkpointX,
      this.renderer.height,
      0xffff00
    );

    this.physics.add.existing(this.checkpointLine);

    this.physics.add.overlap(
      this.checkpointLine,
      this.obstacle.sprite,
      this.obstacleReachedCheckpoint.bind(this)
    );

    console.log("Starting score:", this.score);
  }
  obstacleReachedCheckpoint(
    checkpointLine: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    this.increaseScore();
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

    if (
      this.checkpointLine.body.position.y >
      this.renderer.height - this.checkpointLine.height
    ) {
      this.checkpointLine.body.position.y =
        this.renderer.height - this.checkpointLine.height;
    }

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

      // Stop obstacle and player moving after collision
      obstacle.body.velocity.x = 0;
      player.body.velocity.x = 0;
    }
  }

  increaseScore() {
    this.setScore(this.score + 1);
  }

  setScore(num: number) {
    this.score = num;
    console.log("New Score:", this.score);
  }
}
