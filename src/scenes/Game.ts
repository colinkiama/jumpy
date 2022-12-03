import Phaser, { Tilemaps } from "phaser";
import Player from "../objects/Player";
import Obstacle, {
  BLOCK_OBSTACLE_COLOR,
  BLOCK_OBSTACLE_HEIGHT,
  BLOCK_OBSTACLE_WIDTH,
  ObstacleType,
} from "../objects/Obstacle";
import ObstacleFactory from "../objects/ObstacleFactory";

export default class Demo extends Phaser.Scene {
  private hasObstacleCollidedWithPlayer: boolean = false;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private player!: Player;
  private obstacles: Obstacle[] = [];
  // private obstacle!: Obstacle;
  private checkpointLine!: Phaser.GameObjects.Line;
  private hasObstacleOverlappedCheckpoint: boolean = false;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    this.data.set("score", 0);
    this.player = this.setupPlayer();
    this.checkpointLine = this.setupCheckpointLine();
    this.addBlockObstacle();

    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
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

  setupCheckpointLine() {
    const thresholdDistance = 10;
    let checkpointX =
      this.player.sprite.width - thresholdDistance - BLOCK_OBSTACLE_WIDTH;

    let createdCheckpointLine = this.add.line(
      checkpointX,
      this.renderer.height / 2,
      checkpointX,
      0,
      checkpointX,
      this.renderer.height,
      0xffff00
    );

    this.physics.add.existing(createdCheckpointLine);

    return createdCheckpointLine;
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
    let massObjects = [...this.obstacles, this.player];
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

  addBlockObstacle() {
    let createdObstacle = new Obstacle(
      ObstacleFactory.getObstacleVariation({
        type: ObstacleType.BLOCK,
        width: BLOCK_OBSTACLE_WIDTH,
        height: BLOCK_OBSTACLE_HEIGHT,
        color: BLOCK_OBSTACLE_COLOR,
      }),
      this
    );

    this.setupObstacleCollisions(createdObstacle);
    this.obstacles.push(createdObstacle);
  }

  setupObstacleCollisions(obstacle: Obstacle) {
    this.physics.add.existing(obstacle.sprite);
    obstacle.sprite.body.velocity.x = -400;
    this.physics.collide(
      obstacle.sprite,
      this.player.sprite,
      this.playerHitObstacle
    );

    this.physics.add.overlap(
      this.checkpointLine,
      obstacle.sprite,
      this.obstacleReachedCheckpoint.bind(this)
    );
  }

  setupPlayer() {
    let createdPlayer = new Player(this);
    this.physics.add.existing(createdPlayer.sprite);

    return createdPlayer;
  }
}
