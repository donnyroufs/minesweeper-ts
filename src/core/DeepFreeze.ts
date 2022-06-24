export class DeepFreeze {
  public static freeze(data: any) {
    const propNames = Object.getOwnPropertyNames(data)

    for (const name of propNames) {
      const value = data[name]

      if (value && typeof value === "object") {
        this.freeze(value)
      }
    }

    return Object.freeze(data)
  }
}
