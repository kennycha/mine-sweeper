export type Nullable<T> = T | null;

export type GamePhaseTypes = "ready" | "playing" | "success" | "failed";

export type GameModeTypes = "beginner" | "intermediate" | "expert" | "custom";

export interface Cell {
  i: number;
  j: number;
  isOpened: boolean;
  mineCount: number;
  hasFlag: boolean;
}
