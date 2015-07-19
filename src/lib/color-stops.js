export function getLengths(stops) {
  return stops.map(stop => {
    if (stop.length) {
      return {
        type: stop.length.type,
        value: parseInt(stop.length.value, 10)
      };
    }
  });
}

export function getNextIndexWithLength(stops, fromIndex) {
  const l = stops.length - 1;

  for (let i = fromIndex; i <= l; i++) {
    if (stops[i] && stops[i].type && stops[i].value) return i;
  }

  return l;
}

export function normalizeLength(length, gradientLineLength) {
  if (length) {
    switch (length.type) {
      case '%':
        return length.value;
      case 'px':
        return (length.value / gradientLineLength) * 100;
    }
  }
}

export function resolveLengths(stops, gradientLineLength) {
  const g = gradientLineLength;

  let prev = 0;

  return stops.map((stop, i) => {
    const currLength = normalizeLength(stop, g);
    const prevLength = normalizeLength(stops[prev], g) || 0;

    if (currLength) {
      if (currLength < prevLength) {
        return prevLength;
      } else {
        prev = i;
        return currLength;
      }
    }

    const next = getNextIndexWithLength(stops, i);
    const steps = next - prev;

    const nextLength = normalizeLength(stops[next], g) || 100;
    const diffLength = nextLength - prevLength;

    return prevLength + ((diffLength / steps) * (i - prev));
  });
}
