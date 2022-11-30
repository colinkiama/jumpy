import Phaser, { Tilemaps } from "phaser";
import Player from "../objects/Player";
import Obstacle from "../objects/Obstacle";

export default class Demo extends Phaser.Scene {
  private hasObstacleCollidedWithPlayer: boolean = false;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private player!: Player;
  private obstacle!: Obstacle;
  private checkpointLine!: Phaser.GameObjects.Line;
  private hasObstacleOverlappedCheckpoint: boolean = false;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    this.data.set("score", 0);
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
      this.player.sprite.width - thresholdDistance - this.obstacle.sprite.width;

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

    this.scoreText = this.add.text(100, 100, "", {
      font: "64px Courier",
      color: "#00ff00",
    });

    this.scoreText.setText(["Score: " + this.data.get("score")]);

    this.data.events.on(
      "changedata-score",
      (currentScene: Phaser.Scene, nextValue: number) => {
        this.scoreText.setText(["Score: " + this.data.get("score")]);
      }
    );
  }
  obstacleReachedCheckpoint(
    checkpointLine: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    if (!this.hasObstacleOverlappedCheckpoint) {
      this.hasObstacleOverlappedCheckpoint = true;
      this.increaseScore();
    }
  }

  update() {
    let massObjects = [this.obstacle, this.player];

    massObjects.forEach((obj) => {
      let objectBody = obj.sprite.body;

      // Prevent objects from falling thought bottom edge of screen
      if (objectBody.position.y > this.renderer.height - obj.sprite.height) {
        objectBody.position.y = this.renderer.height - obj.sprite.height;
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
    let currentScore = this.data.get("score") as number;
    this.setScore(currentScore + 1);
  }

  setScore(nextScore: number) {
    this.data.set("score", nextScore);
  }
}
