import { PipetteMetaInfo } from "./pipette";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FinishCallback } from ".";
import { RootCanvas } from "../../canvas/model";
import { ToolManager } from "./tool-manager";
import { Renderer } from "../../renderer";
import { MouseChangeStatusHandler } from "../../../shared/lib/move-insepector";
import { RgbColor } from "../../../shared/lib";

export interface ActivePipette {
  name: "pipette";
  state: "active";
}

export interface ActiveMover {
  name: "mover";
  state: "wait" | "grabbing";
}

export type ActiveTool = ActivePipette | ActiveMover | null;

export interface ColorInfo {
  value: RgbColor;
  metaInfo: PipetteMetaInfo;
}

interface InitialState {
  toolManager: ToolManager | null;
  pipetteColor: RgbColor | null;
  activeTool: ActiveTool;
  primaryPipetteColor: ColorInfo | null;
  secondaryPipetteColor: ColorInfo | null;

  dragSpeedCoef: number;
}

const initialState: InitialState = {
  toolManager: null,
  pipetteColor: null,
  activeTool: null,

  primaryPipetteColor: null,
  secondaryPipetteColor: null,
  dragSpeedCoef: 5,
};

export const toolSlice = createSlice({
  name: "toolSlice",
  initialState,
  reducers: {
    initToolManager(
      state,
      action: PayloadAction<{
        canvas: RootCanvas;
        renderer: Renderer;
        onPipetteChange: FinishCallback;
      }>
    ) {
      if (state.toolManager) return;
      state.toolManager = new ToolManager(
        action.payload.canvas,
        action.payload.renderer,
        action.payload.onPipetteChange
      );
    },

    startPipetteClick(state) {
      if (!state.toolManager) throw new Error("tool manager");
      state.toolManager.pipetteTool.startTool();
      console.log("startPipetteClick");
    },

    stopPipetteClick(state) {
      if (!state.toolManager) throw new Error("tool manager");
      state.toolManager.pipetteTool.stopTool();
    },

    startMover(state, action: PayloadAction<MouseChangeStatusHandler>) {
      if (!state.toolManager) throw new Error("tool manager");
      state.toolManager.moverTool.startTool(action.payload);
    },

    stopMover(state) {
      if (!state.toolManager) throw new Error("tool manager");
      console.log("state.toolManager.moverTool.stopTool();");
      state.toolManager.moverTool.stopTool();
      state.activeTool = null;
    },

    setSpeedCoef(state, action: PayloadAction<number>) {
      state.toolManager?.moverTool.setSpeed(action.payload);
      state.dragSpeedCoef = action.payload;
    },

    setPipetteColor(state, action: PayloadAction<RgbColor>) {
      state.pipetteColor = action.payload;
    },
    setPrimaryColor(state, action: PayloadAction<ColorInfo>) {
      state.primaryPipetteColor = action.payload;
    },
    setSecondaryColor(state, action: PayloadAction<ColorInfo>) {
      state.secondaryPipetteColor = action.payload;
    },
    setActiveTool(state, action: PayloadAction<ActiveTool>) {
      if (!state.toolManager) throw new Error("tool manager");
      if (state.activeTool && state.activeTool.name !== action.payload?.name) {
        if (state.activeTool.name === "mover") {
          state.toolManager.moverTool.stopTool();
        }
        if (state.activeTool.name === "pipette") {
          state.toolManager.pipetteTool.stopTool();
        }
      }
      state.activeTool = action.payload;
    },
  },
});

export const {
  initToolManager,
  startPipetteClick,
  stopPipetteClick,
  setPipetteColor,
  setActiveTool,
  startMover,
  stopMover,
  setPrimaryColor,
  setSecondaryColor,
  setSpeedCoef,
} = toolSlice.actions;
