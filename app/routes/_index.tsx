import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import React, { useRef } from 'react';
import PromptInput from '~/components/PromptInput';
import { useLoaderData } from '@remix-run/react';
import { getPrompts } from '~/data';
import { promptReducer } from '~/store/reducers';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async () => {
  const fakePrompts = await getPrompts();
  return json({ fakePrompts });
};

export default function Index() {
  const { fakePrompts } = useLoaderData<typeof loader>();
  const [prompts, dispatch] = React.useReducer(promptReducer, []);
  const promptRefs = useRef<(React.RefObject<HTMLInputElement> | null)[]>([]);
  const [promptText, setPromptText] = React.useState('');
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const createPrompt = React.useCallback(
    (x: number, y: number) => {
      const newPrompt = {
        x,
        y,
      };
      dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
    },
    [dispatch],
  );
  const initialPromptsLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!initialPromptsLoadedRef.current && fakePrompts) {
      fakePrompts.forEach((prompt) => {
        if (prompt.x && prompt.y) {
          console.log('Dispatching add prompt:', prompt);
          dispatch({
            type: 'ADD_PROMPT',
            payload: { x: prompt.x, y: prompt.y },
          });
        }
      });
      initialPromptsLoadedRef.current = true; // Set the flag to true after loading initial prompts
    }
  }, [fakePrompts]);

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    createPrompt(x, y);
  }
  function handleChange(newPromptText: string) {
    setPromptText(newPromptText);
  }
  function switchToFullScreen() {
    setIsFullScreen(true);
  }
  return (
    <div onClick={handleClick} className='universe' id='universe'>
      {isFullScreen && (
        <div className='full-screen' data-testid='full-screen'>
          <p>{promptText}</p>
        </div>
      )}
      {prompts &&
        !isFullScreen &&
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
