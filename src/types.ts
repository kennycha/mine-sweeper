export type GameModeTypes = "beginner" | "intermediate" | "expert" | "custom";

export interface Cell {
  i: number;
  j: number;
  isOpened: boolean;
  hasMine: boolean;
}
