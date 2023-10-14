export interface IPrompt {
  x: number;
  y: number;
}

export type PromptAction =
  | { type: 'ADD_PROMPT'; payload: IPrompt }
  | { type: 'REMOVE_PROMPT'; payload: number };
