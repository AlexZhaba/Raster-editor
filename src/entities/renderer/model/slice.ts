import { RootCanvas, CanvasSubscriber } from "./../../canvas/model/canvas";
import { CANVAS_ROOT_ID } from "../../canvas/model/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Renderer } from "../../renderer/model";
import { DrawableImage } from "../../drawable-object/ui/drawable-image";
import { RendererSubscriber } from "./renderer";

interface CanvasSize {
  width: number | null;
  height: number | null;
}
interface InitialState {
  renderer: null | Renderer;
  canvas: RootCanvas | null;
  isCanvasEmpty: boolean;
  isLoadingImage: boolean;
  isLastLoadImageFailed: boolean;

  cursorX: number | null;
  cursorY: number | null;

  canvasSize: CanvasSize;
}

const initialState: InitialState = {
  renderer: null,
  canvas: null,
  isCanvasEmpty: false,
  isLoadingImage: false,
  isLastLoadImageFailed: false,
  cursorX: null,
  cursorY: null,
  canvasSize: {
    width: null,
    height: null,
  },
};

export const loadImageToCanvasByUrl = createAsyncThunk(
  "canvasSlice/loadImageToCanvasByUrl",
  async (url: string) => {
    return await DrawableImage.fromUrl(url);
  }
);

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

    bindCanvasUpdate(state, action: PayloadAction<CanvasSubscriber>) {
      state.canvas?.subscribeToChange(action.payload);
    },

    setIsCanvasEmpty(state, action: PayloadAction<boolean>) {
      state.isCanvasEmpty = action.payload;
    },

    bindRendererUpdate(state, action: PayloadAction<RendererSubscriber>) {
      state.renderer?.subscribe(action.payload);
    },

    addImageToCanvas(state, action: PayloadAction<File>) {
      if (!state.renderer) throw new Error("asd");
      state.renderer.addDrawable(new DrawableImage(action.payload));
    },

    setCursor(state, action: PayloadAction<{ x: number; y: number }>) {
      const { x, y } = action.payload;

      if (x < 0 || y < 0) {
        state.cursorX = null;
        state.cursorY = null;
        return;
      }

      state.cursorY = y;
      state.cursorX = x;
    },
    setCanvasSize(state, action: PayloadAction<CanvasSize>) {
      state.canvasSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadImageToCanvasByUrl.pending, (state, action) => {
      state.isLoadingImage = true;
      state.isLastLoadImageFailed = false;
    });

    builder.addCase(loadImageToCanvasByUrl.fulfilled, (state, action) => {
      if (!state.renderer) throw new Error("asd");
      state.renderer.addDrawable(action.payload);
      state.isLoadingImage = false;
      state.isLastLoadImageFailed = false;
    });

    builder.addCase(loadImageToCanvasByUrl.rejected, (state, action) => {
      state.isLastLoadImageFailed = true;
      state.isLoadingImage = false;
    });
  },
});

export const {
  initRenderer,
  addImageToCanvas,
  bindRendererUpdate,
  setIsCanvasEmpty,
  bindCanvasUpdate,
  setCursor,
  setCanvasSize,
} = canvasSlice.actions;
