import { ISelectorOption } from "../models/selectorOption";

export interface SelectorOptionsState {
  options: ISelectorOption[];
  loading: boolean;
  error: string | null;
}
