import type { MetaFunction } from '@remix-run/node';
import React from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    console.log({ x, y });
  }
  return (
    <div onClick={handleClick} className="universe" id='universe'>
      Hello world
    </div>
  );
}
