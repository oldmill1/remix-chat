export interface IPrompt {
  x: number;
  y: number;
  id: string;
}

export type PromptAction =
  | { type: 'ADD_PROMPT'; payload: IPrompt }
  | { type: 'REMOVE_PROMPT'; payload: number }
  | {
      type: 'UPDATE_PROMPT_POSITION';
      payload: { id: string; x: number; y: number };
    };
