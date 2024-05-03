import { RgbColor, XyzColor } from "./types";

const D65 = [0.3127 / 0.329, 1.0, (1.0 - 0.3127 - 0.329) / 0.329];

export const convertToRgb = (rgb: RgbColor) =>
  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

/**
 * Get gamma expanded values regarding formluta describing here: https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
 */
export const convertsRGBToLinearRGB = (color: number) => {
  if (color <= 0.04045) {
    return color / 12.92;
  }
  return Math.pow((color + 0.055) / 1.055, 2.4);
};

/**
 * Transformation algorithm and matrix values from: https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
 * W3 code examples: https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const convertRgbToXYZ = (rgb: RgbColor, pure = false): XyzColor => {
  const [r, g, b] = rgb.map((c) => c / 255).map(convertsRGBToLinearRGB);

  const X = 0.4124 * r + 0.3576 * g + 0.1805 * b;
  const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;

  if (pure) {
    return [X, Y, Z];
  }
  return [X, Y, Z].map((c) => Math.floor(c * 100)) as XyzColor;
};

/**
 * Algorithm from https://www.w3.org/TR/css-color-4/#color-conversion-code
 * First of all we are converting rgb to xyz, then xyz to lab
 */
export const convertRgbToLab = (rgb: RgbColor) => {
  const XYZ = convertRgbToXYZ(rgb, true);

  const e = 216 / 24389; // 6^3/29^3
  const k = 24389 / 27; // 29^3/3^3

  const xyz = XYZ.map((value, i) => value / D65[i]);

  // now compute f
  const f = xyz.map((value) =>
    value > e ? Math.cbrt(value) : k * value + 16 / 116
  );

  return [
    Math.floor(116 * f[1] - 16), // L
    Math.floor(500 * (f[0] - f[1])), // a
    Math.floor(200 * (f[1] - f[2])), // b
  ];
};
