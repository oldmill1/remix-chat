import type { MetaFunction } from '@remix-run/node';
import React from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const [prompts, setPrompts] = React.useState<{ x: number; y: number }[]>([]);
  function openPromptBoxAtLocation(x, y) {
    const newPrompt = {
      x,
      y,
    };
    setPrompts((prompts) => [...prompts, newPrompt]);
  }
  console.log({ prompts });
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    openPromptBoxAtLocation(x, y);
  }
  return <div onClick={handleClick} className='universe' id='universe'></div>;
}
