import type { MetaFunction } from '@remix-run/node';
import React, { useRef } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const [prompts, setPrompts] = React.useState<{ x: number; y: number }[]>([]);
  const [mode, setMode] = React.useState<'view' | 'edit'>('view');
  const promptRefs = useRef<(React.RefObject<HTMLInputElement> | null)[]>([]);
  function openPromptBoxAtLocation(x: number, y: number) {
    const newPrompt = {
      x,
      y,
    };
    setPrompts((prevPrompts) => {
      const newPrompts = [...prevPrompts, newPrompt];
      promptRefs.current = new Array(newPrompts.length)
        .fill(null)
        .map((_, i) => promptRefs.current[i] || React.createRef());
      return newPrompts;
    });
  }
  console.log({ prompts });
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (mode === 'edit') return;
    const x = e.clientX;
    const y = e.clientY;
    openPromptBoxAtLocation(x, y);
    setMode('edit');
    const lastRef = promptRefs.current[promptRefs.current.length - 1];
    if (lastRef) {
      lastRef.current?.focus();
    }
  }
  console.log({ promptRefs });
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
            <input type='text' autoFocus />
          </div>
        ))}
    </div>
  );
}
