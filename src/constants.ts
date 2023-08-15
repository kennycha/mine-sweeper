import { GameConfig } from "./types";

export const GAME_CONFIG_PRESETS: { [key: string]: GameConfig } = {
  beginner: { width: 8, height: 8, count: 10 },
  intermediate: { width: 16, height: 16, count: 40 },
  expert: { width: 32, height: 16, count: 100 },
};

export const ALL_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
