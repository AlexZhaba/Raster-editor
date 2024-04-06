import { RootCanvas } from "./../../canvas/model/canvas";
import { CANVAS_ROOT_ID } from "../../canvas/model/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Renderer } from "../../renderer/model";
import { DrawableImage } from "../../drawable-object/ui/drawable-image";
import { Subscriber } from "./renderer";

interface InitialState {
  renderer: null | Renderer;
  canvas: RootCanvas | null;
  isCanvasEmpty: boolean;
}

const initialState: InitialState = {
  renderer: null,
  canvas: null,
  isCanvasEmpty: false,
};

export const canvasSlice = createSlice({
  name: "canvasSlice",
  initialState,
  reducers: {
    initRenderer(state) {
      const canvas = new RootCanvas(CANVAS_ROOT_ID);
      const renderer = new Renderer(canvas);
      state.renderer = renderer;
      state.canvas = canvas;
    },

    setIsCanvasEmpty(state, action: PayloadAction<boolean>) {
      state.isCanvasEmpty = action.payload;
    },

    bindRendererUpdate(state, action: PayloadAction<Subscriber>) {
      state.renderer?.subscribe(action.payload);
    },

    addImageToCanvas(state, action: PayloadAction<File>) {
      if (!state.renderer) throw new Error("asd");
      state.renderer.addDrawable(new DrawableImage(action.payload));
    },
  },
});

export const {
  initRenderer,
  addImageToCanvas,
  bindRendererUpdate,
  setIsCanvasEmpty,
} = canvasSlice.actions;
