import { Range } from "./Range"

export class RandomNumberGenerator {
  public static generate({ min, max }: Range) {
    return Math.floor(Math.random() * (max - min) + min)
  }
}
