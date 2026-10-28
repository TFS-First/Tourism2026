const getDynamicFontSize = (text) => {
  const len = Array.from(text || '').length;
  if (len > 7) return 'text-lg md:text-xl';
  if (len > 4) return 'text-xl md:text-2xl';
  if (len > 2) return 'text-2xl md:text-3xl';
  return 'text-3xl md:text-4xl';
};

const parseHieroglyphWord = (str) => {
  str = str.trim();
  while (str.startsWith("(") && str.endsWith(")")) {
    let depth = 0;
    let wraps = true;
    for (let i = 0; i < str.length - 1; i++) {
      if (str[i] === "(") depth++;
      else if (str[i] === ")") depth--;
      if (depth === 0) { wraps = false; break; }
    }
    if (wraps) str = str.slice(1, -1).trim();
    else break;
  }

  let depth = 0;
  const hParts = [];
  let current = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "*" && depth === 0) {
      hParts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  hParts.push(current);

  if (hParts.length > 1) {
    return { type: "row", items: hParts.map(parseHieroglyphWord) };
  }

  depth = 0;
  const vParts = [];
  current = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === ":" && depth === 0) {
      vParts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  vParts.push(current);

  if (vParts.length > 1) {
    return { type: "stack", items: vParts.map(parseHieroglyphWord) };
  }

  return { type: "sign", text: str };
};
