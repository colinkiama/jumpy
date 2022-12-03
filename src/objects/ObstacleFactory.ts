import { ObstacleVariation, ObstacleVariationProps } from "./Obstacle";

export default class ObstacleFactory {
  static obstacleVariations: ObstacleVariation[] = [];

  private constructor() {}

  static getObstacleVariation(
    props: ObstacleVariationProps
  ): ObstacleVariation {
    return (
      this.obstacleVariations.find((variation) =>
        ObstacleFactory.matchVariation(variation, props)
      ) ?? new ObstacleVariation(props)
    );
  }

  private static matchVariation(
    variation: ObstacleVariation,
    props: ObstacleVariationProps
  ): boolean {
    return (
      variation.type === props.type &&
      variation.color === props.color &&
      variation.height === props.height &&
      variation.width === props.width
    );
  }
}
