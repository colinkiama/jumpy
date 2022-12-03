import Phaser from "phaser";

export const BLOCK_OBSTACLE_WIDTH = 100;
export const BLOCK_OBSTACLE_HEIGHT = 80;
export const BLOCK_OBSTACLE_COLOR = 0xff0000;

export enum ObstacleType {
  BLOCK,
}

export type ObstacleVariationProps = {
  type: ObstacleType;
  width: number;
  height: number;
  color: number;
};

export class ObstacleVariation {
  width: number;
  height: number;
  type: ObstacleType;
  color: number;

  constructor(props: ObstacleVariationProps) {
    this.width = props.width;
    this.height = props.height;
    this.type = props.type;
    this.color = props.color;
  }
}
export default class Obstacle {
  private _obstacleVariation: ObstacleVariation;
  private _scene: Phaser.Scene;

  completed: boolean;

  sprite: Phaser.GameObjects.Rectangle;

  constructor(type: ObstacleVariation, scene: Phaser.Scene) {
    this._obstacleVariation = type;
    this._scene = scene;
    this.completed = false;

    let startingOffsetX =
      this._scene.renderer.width + this._obstacleVariation.width * 2;
    let startingOffsetY =
      this._scene.renderer.height - this._obstacleVariation.height / 2;

    switch (this._obstacleVariation.type) {
      case ObstacleType.BLOCK:
        this.sprite = this._scene.add.rectangle(
          startingOffsetX,
          startingOffsetY,
          this._obstacleVariation.width,
          this._obstacleVariation.height,
          this._obstacleVariation.color
        );

        break;
    }
  }

  complete() {
    this.completed = true;
  }
}
