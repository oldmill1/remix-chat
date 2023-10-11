import type { MetaFunction } from '@remix-run/node';
import React from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const [currX, setCurrX] = React.useState(0);
  const [currY, setCurrY] = React.useState(0);
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    setCurrX(x);
    setCurrY(y);
  }
  return <div onClick={handleClick} className='universe' id='universe'></div>;
}
