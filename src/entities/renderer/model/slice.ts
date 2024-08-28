import { RootCanvas, CanvasSubscriber } from "./../../canvas/model/canvas";
import { CANVAS_ROOT_ID } from "../../canvas/model/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Renderer } from "../../renderer/model";
import { DrawableImage } from "../../drawable-object/model/drawable-image";
import { PARENT_CONTAINER_ID, RendererSubscriber } from "./renderer";
import { RgbStatistic, getRgbStatistic } from "../../../shared/lib";
import { RootState } from "../../../app/store";

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

  scaleInPercent: number;

  cursorX: number | null;
  cursorY: number | null;

  rgbStat: RgbStatistic | null;

  canvasSize: CanvasSize;
  imagesSize: CanvasSize;
  defaultScaled: boolean;
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
  imagesSize: {
    width: null,
    height: null,
  },
  rgbStat: null,
  scaleInPercent: 100,
  defaultScaled: false,
};

export const loadImageToCanvasByUrl = createAsyncThunk(
  "canvasSlice/loadImageToCanvasByUrl",
  async (url: string) => {
    const image = await DrawableImage.fromUrl(url);
    await image.init();

    return image;
  }
);

export const loadImageToCanvasByFile = createAsyncThunk(
  "canvasSlice/loadImageToCanvasFromFile",
  async (file: File) => {
    const image = new DrawableImage(file);
    await image.init();

    console.log("return");
    return image;
  }
);

export const getRgbStatisticByDrawable = createAsyncThunk(
  "canvasSlice/getRgbStatisticByDrawable",
  async (index: number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    console.log("state", state);
    const drawableData = await state.canvasSlice.renderer
      ?.getDrawable(index)
      ?.getData();

    if (!drawableData?.data) {
      return null;
    }

    return getRgbStatistic(drawableData.data);
  }
);

export const canvasSlice = createSlice({
  name: "canvasSlice",
  initialState,
  reducers: {
    initRenderer(state) {
      const canvas = new RootCanvas(CANVAS_ROOT_ID);
      const renderer = new Renderer(PARENT_CONTAINER_ID, canvas);
      state.renderer = renderer;
      state.canvas = canvas;
    },

    bindCanvasUpdate(state, action: PayloadAction<CanvasSubscriber>) {
      state.canvas?.subscribeToChange(action.payload);
    },

    setIsCanvasEmpty(state, action: PayloadAction<boolean>) {
      state.isCanvasEmpty = action.payload;
    },

    setScale(state, action: PayloadAction<number>) {
      state.scaleInPercent = action.payload;
      state.renderer?.scale(state.scaleInPercent / 100);
    },

    resizeImages(
      state,
      action: PayloadAction<{ scaleX: number; scaleY: number }>
    ) {
      console.log(action.payload);
      state.renderer?.resize(action.payload.scaleX, action.payload.scaleY);
    },

    bindRendererUpdate(state, action: PayloadAction<RendererSubscriber>) {
      state.renderer?.subscribe(action.payload);
    },

    defaultResizeCanvasToFullWidthImage(state) {
      if (state.defaultScaled) return;
      if (!state.renderer) throw new Error("da");
      state.defaultScaled = true;

      const scaleCoef = state.renderer.getScaleCanvasToFullWidthImage();
      state.scaleInPercent = scaleCoef * 100;
      state.renderer.scale(scaleCoef);
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
    setImagesSize(state, action: PayloadAction<CanvasSize>) {
      state.imagesSize = action.payload;
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

    builder.addCase(loadImageToCanvasByFile.fulfilled, (state, action) => {
      if (!state.renderer) throw new Error("asd");
      state.renderer.addDrawable(action.payload);
    });

    builder.addCase(getRgbStatisticByDrawable.fulfilled, (state, action) => {
      state.rgbStat = action.payload;
    });
  },
});

export const {
  initRenderer,
  bindRendererUpdate,
  setIsCanvasEmpty,
  bindCanvasUpdate,
  setCursor,
  setCanvasSize,
  setScale,
  defaultResizeCanvasToFullWidthImage,
  setImagesSize,
  resizeImages,
} = canvasSlice.actions;
