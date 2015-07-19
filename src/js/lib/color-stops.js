export function resolve(stops, gradientLineLength) {
  const g = gradientLineLength;

  let prev = 0;

  return stops.map((stop, i) => {
    const currLength = getNormalizedStopLength(stop, g);
    const prevLength = getNormalizedStopLength(stops[prev], g) || 0;

    if (currLength) {
      if (currLength < prevLength) {
        prev--;
        return prevLength;
      } else {
        prev = i;
        return currLength;
      }
    }

    const next = getNextIndexWithLength(stops, i);
    const steps = next - prev;

    const nextLength = getNormalizedStopLength(stops[next], g) || 100;
    const diffLength = nextLength - prevLength;

    return prevLength + ((diffLength / steps) * (i - prev));
  });
}

export function getNextIndexWithLength(stops, fromIndex) {
  const l = stops.length - 1;

  for (let i = fromIndex; i <= l; i++) {
    if (stops[i] && stops[i].type && stops[i].length) return i;
  }

  return l;
}

export function getNormalizedStopLength(stop, gradientLineLength) {
  if (stop.length) {
    const value = parseInt(stop.length.value, 10);

    switch (stop.length.type) {
      case '%':
        return value;
      case 'px':
        return (value / gradientLineLength) * 100;
    }
  }
}

export function getStopColorValue(stop) {
  switch (stop.type) {
    case 'rgb':
      return `rgb(${stop.value.join(', ')})`;
    case 'rgba':
      return `rgba(${stop.value.join(', ')})`;
    default:
      return stop.value;
  }
}
