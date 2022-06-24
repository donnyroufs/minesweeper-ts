import { RandomNumberGenerator } from "./RandomNumberGenerator"
import { Range } from "./Range"

describe("random number generator", () => {
  test("returns a number within a given range", () => {
    const number = RandomNumberGenerator.generate(new Range(0, 1))

    for (let i = 0; i < 5; i++) {
      const res = [0, 1].some((val) => number === val)
      expect(res).toBe(true)
    }
  })
})
