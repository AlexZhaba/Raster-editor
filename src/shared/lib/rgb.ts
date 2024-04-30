import { RgbColor } from "./types";

export const convertToRgb = (rgb: RgbColor) =>
  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
