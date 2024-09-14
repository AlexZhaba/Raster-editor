const DEFAULT_MATRIX_PRESET = [0, 0, 0, 0, 1, 0, 0, 0, 0];
const SHARP_MATRIX_PRESET = [0, -1, 0, -1, 5, -1, 0, -1, 0];
const GAUSE_MATRIX_PRESET = [1, 2, 1, 2, 4, 2, 1, 2, 1];
const RECT_BLUR_PRESET = [1, 1, 1, 1, 1, 1, 1, 1, 1];

const MATRIX_PRESET_MAP: Record<string, number[]> = {
  default: DEFAULT_MATRIX_PRESET,
  sharp: SHARP_MATRIX_PRESET,
  gause: GAUSE_MATRIX_PRESET,
  blur: RECT_BLUR_PRESET,
};

export {
  DEFAULT_MATRIX_PRESET,
  SHARP_MATRIX_PRESET,
  GAUSE_MATRIX_PRESET,
  RECT_BLUR_PRESET,
  MATRIX_PRESET_MAP,
};