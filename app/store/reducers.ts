import type { IPrompt, PromptAction } from '~/types';
import { ADD_PROMPT, UPDATE_PROMPT_POSITION } from '~/store/actions';

// Action creators
export const addPrompt = (payload: { x: number; y: number; id: string }) => ({
  type: ADD_PROMPT,
  payload,
});

export const promptReducer = (state: IPrompt[], action: PromptAction) => {
  switch (action.type) {
    case ADD_PROMPT:
      return [...state, action.payload];
    case UPDATE_PROMPT_POSITION:
      return state.map((prompt) => {
        if (prompt.id === action.payload.id) {
          return {
            ...prompt,
            x: action.payload.x,
            y: action.payload.y,
          };
        }
        return prompt;
      });
    default:
      return state;
  }
};
