import type { MetaFunction } from '@remix-run/node';
import React, { useRef } from 'react';
import PromptInput from '~/components/PromptInput';
import type { IPrompt } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

type PromptAction =
  | { type: 'ADD_PROMPT'; payload: IPrompt }
  | { type: 'REMOVE_PROMPT'; payload: number };

const promptReducer = (state: IPrompt[], action: PromptAction) => {
  switch (action.type) {
    case 'ADD_PROMPT':
      return [...state, action.payload];
    default:
      return state;
  }
};

export default function Index() {
  const [prompts, dispatch] = React.useReducer(promptReducer, []);
  const [mode, setMode] = React.useState<'view' | 'edit'>('view');
  const promptRefs = useRef<(React.RefObject<HTMLInputElement> | null)[]>([]);
  const [promptText, setPromptText] = React.useState('');
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  function createPrompt(x: number, y: number) {
    const newPrompt = {
      x,
      y,
    };
    dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
    // Update refs
    promptRefs.current = new Array(prompts.length + 1)
      .fill(null)
      .map((_, i) => promptRefs.current[i] || React.createRef());
  }
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (mode === 'edit') {
      focusLastRef();
    } else if (mode === 'view') {
      const x = e.clientX;
      const y = e.clientY;
      createPrompt(x, y);
      setMode('edit');
      focusLastRef();
    }
  }
  function handleChange(newPromptText: string) {
    setPromptText(newPromptText);
  }
  function focusLastRef() {
    const lastRef = promptRefs.current[promptRefs.current.length - 1];
    if (lastRef) {
      lastRef.current?.focus();
    }
  }
  function switchToFullScreen() {
    setIsFullScreen(true);
  }
  return (
    <div onClick={handleClick} className='universe' id='universe'>
      {isFullScreen && (
        <div data-testid='full-screen'>
          <p>{promptText}</p>
        </div>
      )}
      {prompts &&
        prompts.map((prompt, index) => (
          <PromptInput
            key={index}
            index={index}
            prompt={prompt}
            promptRefs={promptRefs}
            promptText={promptText}
            setPromptText={handleChange}
            switchToFullScreen={switchToFullScreen}
          />
        ))}
    </div>
  );
}
