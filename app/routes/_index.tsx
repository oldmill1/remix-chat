import type { MetaFunction } from '@remix-run/node';
import React, { useRef } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

interface Prompt {
  x: number;
  y: number;
}

type PromptAction =
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'REMOVE_PROMPT'; payload: number };

const promptReducer = (state: Prompt[], action: PromptAction) => {
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
  function openPromptBoxAtLocation(x: number, y: number) {
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
  console.log({ prompts });
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (mode === 'edit') {
      focusLastRef();
    } else if (mode === 'view') {
      const x = e.clientX;
      const y = e.clientY;
      openPromptBoxAtLocation(x, y);
      setMode('edit');
      focusLastRef();
    }
  }
  function focusLastRef() {
    console.log({ promptRefs });
    const lastRef = promptRefs.current[promptRefs.current.length - 1];
    if (lastRef) {
      lastRef.current?.focus();
    }
  }
  return (
    <div onClick={handleClick} className='universe' id='universe'>
      {prompts &&
        prompts.map((prompt, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${prompt.x}px`,
              top: `${prompt.y}px`,
            }}
          >
            <input type='text' ref={promptRefs.current[index]} autoFocus />
          </div>
        ))}
    </div>
  );
}
