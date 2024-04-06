import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FinishCallback } from ".";
import { RootCanvas } from "../../canvas/model";
import { ToolManager } from "./tool-manager";

interface InitialState {
  toolManager: ToolManager | null;
  pipetteColor: string | null;
}

const initialState: InitialState = {
  toolManager: null,
  pipetteColor: null,
};

export const toolSlice = createSlice({
  name: "toolSlice",
  initialState,
  reducers: {
    initToolManager(state, action: PayloadAction<RootCanvas>) {
      state.toolManager = new ToolManager(action.payload);
    },

    startPipetteClick(state, action: PayloadAction<FinishCallback>) {
      if (!state.toolManager) throw new Error("tool manager");
      state.toolManager.startTool("pipette", action.payload);
    },

    setPipetteColor(state, action: PayloadAction<string>) {
      state.pipetteColor = action.payload;
    },
  },
});

export const { initToolManager, startPipetteClick, setPipetteColor } =
  toolSlice.actions;
