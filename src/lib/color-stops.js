export function getLengths(colorStops) {
  return colorStops.map(colorStop => {
    if (colorStop.length) return parseInt(colorStop.length.value, 10);
  });
}

export function getNextIndexWithLength(lengths, fromIndex) {
  const l = lengths.length - 1;

  for (let i = fromIndex; i <= l; i++) {
    if (lengths[i]) return i;
  }

  return l;
}

export function resolveLengths(lengths) {
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

    const next = getNextIndexWithLength(lengths, i);
    const steps = next - prev;

    const nextLength = lengths[next] || 100;
    const diffLength = nextLength - prevLength;

    return prevLength + ((diffLength / steps) * (i - prev));
  });
}
