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
  private hasObstacleCollidedWithPlayer!: boolean;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private player!: Player;
  private obstacles!: Obstacle[];
  private checkpointLine!: Phaser.GameObjects.Line;
  private scoreText!: Phaser.GameObjects.Text;
  private buttonReset!: Phaser.GameObjects.Rectangle;
  private gameOverText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    this.obstacles = [];
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

    this.gameOverText = this.add.text(400 - 40 , 300 - 10, 'GameOver', {
      color: '#000000'}).setDepth(2);
    this.gameOverText.visible = false;
    this.buttonReset = this.add.rectangle(400 - 100, 300 - 40, 200, 80, 
      0xffffff).setDepth(1).setOrigin(0, 0);
    this.buttonReset.visible = false;
    this.buttonReset.setInteractive({ useHandCursor: true });
    this.buttonReset.on('pointerup', () => this.scene.start("GameScene"));

    this.scoreText.setText(["Score: " + this.data.get("score")]);
    this.data.events.on(
      "changedata-score",
      (currentScene: Phaser.Scene, nextValue: number) => {
        this.scoreText.setText(["Score: " + this.data.get("score")]);
      }
    );

    this.startSpawner();
  }

  startSpawner() {
    setTimeout( () => {
      if(!this.hasObstacleCollidedWithPlayer) {
        this.addBlockObstacle();
        this.startSpawner()
      } 
    }, this.getIntervalBetweenSpawn() )
  }

  setupCheckpointLine() {
    const thresholdDistance = 10;

    // let checkpointX = 100;
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
    obstacle: Obstacle
  ) {
    this.increaseScore();
    obstacle.complete();
  }

  update() {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
        this.handleObstacleMoveToOffScreen(this.obstacles[i]);
      
        if(this.obstacles[i]) {
          if (this.obstacles[i].sprite.x > 200 ||
            this.hasObstacleCollidedWithPlayer) {
            continue;
          }
    
          console.log(
            "Player:",
            this.player.sprite.body.position.x,
            ",",
            this.player.sprite.body.position.y
          );
    
          console.log(
            "Obstacle:",
            this.obstacles[i].sprite.body.position.x,
            ",",
            this.obstacles[i].sprite.body.position.y
          );
        }
      }

    if (this.keySpace.isDown && this.player.isGrounded) {
      this.player.jump();
    }
  }

  playerHitObstacle(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    if (!this.hasObstacleCollidedWithPlayer) {
      this.gameOver(player);
    }
  }

  gameOver(player: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.hasObstacleCollidedWithPlayer = true;
    console.log("Obstacle hit detected");

    this.gameOverText.visible = true;
    this.buttonReset.visible = true;

    // Stop obstacle and player moving after collision
    this.obstacles.forEach( obstacle => obstacle.sprite.body.velocity.x = 0)
    player.body.velocity.x = 0;
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

  handleObstacleMoveToOffScreen(obstacle: Obstacle) {
    if ( obstacle.sprite.body && obstacle.sprite.body.position.x >= -obstacle.sprite.width) {
      return;
    }

    let deletedObstacles = this.obstacles.splice(
      this.obstacles.indexOf(obstacle),
      1
    );

    if (deletedObstacles.length < 1) {
      return;
    }

    deletedObstacles[0].sprite.destroy();
    console.log("Obstacle destroyed forever:", deletedObstacles[0]);
  }

  getIntervalBetweenSpawn() {
    const MAX = 2000
    const MIN = 1000;
    return Math.random() * (MAX - MIN) + MIN;
  }

  setupObstacleCollisions(obstacle: Obstacle) {
    this.physics.add.existing(obstacle.sprite);
    obstacle.sprite.body.immovable = true;
    obstacle.sprite.body.velocity.x = -400;

    this.physics.add.collider(
      obstacle.sprite,
      this.player.sprite,
      (obstacleSprite, playerSprite) =>
        this.playerHitObstacle(playerSprite)
    );

    this.physics.add.overlap(
      this.checkpointLine,
      obstacle.sprite,
      (checkpointLine, _) => {
        this.obstacleReachedCheckpoint(checkpointLine, obstacle);
      },
      (_, __) => {
        return !obstacle.completed;
      }
    );
  }

  setupPlayer() {
    let createdPlayer = new Player(this);
    this.physics.add.existing(createdPlayer.sprite);
    createdPlayer.sprite.body.collideWorldBounds = true;
    createdPlayer.sprite.body.gravity.y = 2525;

    return createdPlayer;
  }
}
