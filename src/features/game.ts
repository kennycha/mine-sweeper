import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameConfig, GameModeTypes, GamePhaseTypes } from "../types";
import { GAME_CONFIG_PRESETS } from "../constants";

export interface GameState {
  phase: GamePhaseTypes;
  mode: GameModeTypes;
  config: GameConfig;
}

const initialState: GameState = {
  phase: "ready",
  mode: "beginner",
  config: GAME_CONFIG_PRESETS["beginner"],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    changePhase: (state, action: PayloadAction<GamePhaseTypes>) => {
      state.phase = action.payload;
    },
    changeMode: (state, action: PayloadAction<{ mode: GameModeTypes; config?: GameConfig }>) => {
      const { mode, config } = action.payload;
      if (mode === "custom") {
        if (!config) return;
        state.mode = mode;
        state.config = config;
      } else {
        state.mode = mode;
        state.config = GAME_CONFIG_PRESETS[mode];
      }
    },
  },
});

export const { changePhase, changeMode } = gameSlice.actions;

export default gameSlice.reducer;
