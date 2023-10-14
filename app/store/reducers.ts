import type { IPrompt, PromptAction } from '~/types';
import { ADD_PROMPT } from '~/store/actions';

export const promptReducer = (state: IPrompt[], action: PromptAction) => {
  switch (action.type) {
    case ADD_PROMPT:
      return [...state, action.payload];
    default:
      return state;
  }
};
