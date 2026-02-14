  export const rgbaToHex = (rgba) => {
    const [r, g, b, a = 1] = rgba.match(/[\d.]+/g).map(Number);
    const toHex = (x) => Math.round(x).toString(16).padStart(2, "0");
    const alpha = a < 1 ? toHex(a * 255) : "";
    return "#" + toHex(r) + toHex(g) + toHex(b) + alpha;
  };