import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import React from 'react';
import PromptInput from '~/components/PromptInput';
import { useLoaderData } from '@remix-run/react';
import { getPrompts } from '~/data';
import { promptReducer, addPrompt } from '~/store/reducers';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async () => {
  const rawPrompts = await getPrompts();
  return json({ rawPrompts });
};

export default function Index() {
  // This is the raw data
  const { rawPrompts } = useLoaderData<typeof loader>();
  // This is the data that will be used to render the prompts
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [prompts, dispatch] = React.useReducer(promptReducer, []);
  const initialPromptsLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!initialPromptsLoadedRef.current && rawPrompts) {
      rawPrompts.forEach((prompt) => {
        if (prompt.x && prompt.y) {
          dispatch(addPrompt({ x: prompt.x, y: prompt.y, id: prompt.id }));
        }
      });
      initialPromptsLoadedRef.current = true; // Set the flag to true after loading initial prompts
    }
  }, [rawPrompts]);

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    //createPrompt(x, y);
  }
  console.log({ prompts });
  return (
    <div onClick={handleClick} className='universe' id='universe'>
      {isFullScreen && (
        <div className='full-screen' data-testid='full-screen'>
          <p>Something</p>
        </div>
      )}
      {prompts &&
        !isFullScreen &&
        prompts.map((prompt, index) => (
          <PromptInput key={index} index={index} prompt={prompt} />
        ))}
    </div>
  );
}
