export function parse(stops) {
  return stops.map(stop => {
    if (stop.length) {
      return {
        type: stop.length.type,
        value: parseInt(stop.length.value, 10)
      };
    }
  });
}

export function resolve(stops, gradientLineLength) {
  const g = gradientLineLength;
  const s = parse(stops);

  let prev = 0;

  return s.map((stop, i) => {
    const currLength = normalize(stop, g);
    const prevLength = normalize(s[prev], g) || 0;

    if (currLength) {
      if (currLength < prevLength) {
        prev--;
        return prevLength;
      } else {
        prev = i;
        return currLength;
      }
    }

    const next = getNextIndexWithLength(s, i);
    const steps = next - prev;

    const nextLength = normalize(s[next], g) || 100;
    const diffLength = nextLength - prevLength;

    return prevLength + ((diffLength / steps) * (i - prev));
  });
}

export function normalize(length, gradientLineLength) {
  if (length) {
    switch (length.type) {
      case '%':
        return length.value;
      case 'px':
        return (length.value / gradientLineLength) * 100;
    }
  }
}

export function getNextIndexWithLength(stops, fromIndex) {
  const l = stops.length - 1;

  for (let i = fromIndex; i <= l; i++) {
    if (stops[i] && stops[i].type && stops[i].value) return i;
  }

  return l;
}
