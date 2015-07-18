export default class ColorStops {
  constructor(colorStops) {
    this.colorStops = colorStops;
  }

  getLengths() {
    return this.colorStops.map(colorStop => {
      if (colorStop.length) return parseInt(colorStop.length.value, 10);
    });
  }

  getNextIndexWithLength(lengths, fromIndex) {
    const l = lengths.length - 1;

    for (let i = fromIndex; i <= l; i++) {
      if (lengths[i]) return i;
    }

    return l;
  }

  resolveLengths() {
    const lengths = this.getLengths();

    let prev = 0;

    return lengths.map((length, i) => {
      const prevLength = lengths[prev] || 0;

      if (length) {
        if (length < prevLength) {
          return prevLength;
        } else {
          prev = i;
          return length;
        }
      }

      const next = this.getNextIndexWithLength(lengths, i);
      const steps = next - prev;

      const nextLength = lengths[next] || 100;
      const diffLength = nextLength - prevLength;

      return prevLength + ((diffLength / steps) * (i - prev));
    });
  }
}
