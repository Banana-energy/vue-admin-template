/**
 * Mixes two colors.
 * @param {string} color1 - The first color, should be a 6-digit hexadecimal color code starting with `#`.
 * @param {string} color2 - The second color, should be a 6-digit hexadecimal color code starting with `#`.
 * @param {number} [weight] - The weight of color1 in the mix, should be a number between 0 and 1, where 0 represents 100% of color2, and 1 represents 100% of color1.
 * @returns {string} The mixed color, a 6-digit hexadecimal color code starting with `#`.
 */
export function mix(color1: string, color2: string, weight: number = 0.5,): string {
  let color = "#"
  for (let i = 0; i <= 2; i++) {
    const c1 = Number.parseInt(color1.substring(1 + i * 2, 3 + i * 2,), 16,)
    const c2 = Number.parseInt(color2.substring(1 + i * 2, 3 + i * 2,), 16,)
    const c = Math.round(c1 * weight + c2 * (1 - weight),)
    color += c.toString(16,).padStart(2, "0",)
  }
  return color
}

/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 */
export function isHexColor(color: string,) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9A-f]{6})$/
  return reg.test(color,)
}

/**
 * Transform a HEX color to its RGB representation
 * @param {string} hex The color to transform
 * @param {number?} opacity
 * @returns The RGB representation of the passed color
 */
export function hexToRGB(hex: string, opacity?: number,) {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex,)) {
    if (sHex.length === 4) {
      let sColorNew = "#"
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1,).concat(sHex.slice(i, i + 1,),)
      }
      sHex = sColorNew
    }
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(Number.parseInt(`0x${sHex.slice(i, i + 2,)}`,),)
    }
    return opacity
      ? `RGBA(${sColorChange.join(",",)},${opacity})`
      : `RGB(${sColorChange.join(",",)})`
  }
  return sHex
}

export function colorIsDark(color: string,) {
  if (!isHexColor(color,))
    return
  const [r, g, b,] = hexToRGB(color,)
    .replace(/(?:\(|\)|rgb|RGB)*/g, "",)
    .split(",",)
    .map(item => Number(item,),)
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/* Suma el porcentaje indicado a un color (RR, GG o BB) hexadecimal para aclararlo */
/**
 * Sums the passed percentage to the R, G or B of a HEX color
 */
function addLight(color: string, amount: number,) {
  const cc = Number.parseInt(color, 16,) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16,).length > 1 ? c.toString(16,) : `0${c.toString(16,)}`
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number,) {
  color = color.includes("#",) ? color.substring(1, color.length,) : color
  amount = Math.trunc((255 * amount) / 100,)
  return `#${addLight(color.substring(0, 2,), amount,)}${addLight(
    color.substring(2, 4,),
    amount,
  )}${addLight(color.substring(4, 6,), amount,)}`
}
