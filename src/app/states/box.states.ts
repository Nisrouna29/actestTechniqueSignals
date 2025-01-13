import { Box } from "../models/box";

export interface BoxesState {
  boxesMap: Map<number, Box>;
}

export interface BoxSelectionState {
  selectedBox: Box | null;
}
