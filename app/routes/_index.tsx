import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import React from 'react';
import PromptInput from '~/components/PromptInput';
import { useLoaderData } from '@remix-run/react';
import { getPrompts } from '~/data';
import {
  addPrompt,
  promptReducer,
  updatePromptPosition,
} from '~/store/reducers';

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

export default function _index() {
  // This is the raw data
  const { rawPrompts } = useLoaderData<typeof loader>();
  // This is the data that will be used to render the prompts
  const [prompts, dispatch] = React.useReducer(promptReducer, []);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  // This is used to only load data once on initial render
  const initialPromptsLoadedRef = React.useRef(false);
  // This is for recording the id that is currently "selected" for moving
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // This is used to load the data from the loader into frontend state
  // Todo: front end state can differ from backend state, so we need to
  // figure out how to sync the two up using a SAVE button or something
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

  const handlePromptUpdate = async (id: string, x: number, y: number) => {
    try {
      const response = await fetch('/', {
        method: 'POST',
        body: new URLSearchParams({
          promptId: id,
          x: x.toString(),
          y: y.toString(),
        }),
      });

      if (response.ok) {
        console.log({ response });
        dispatch(
          updatePromptPosition({
            id,
            x,
            y,
          }),
        );
      } else {
        console.error('Failed to update prompt position');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    //createPrompt(x, y);
  }
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
          <PromptInput
            key={index}
            index={index}
            prompt={prompt}
            setSelectedId={setSelectedId}
            handlePromptUpdate={(id, x, y) => handlePromptUpdate(id, x, y)}
          />
        ))}
    </div>
  );
}
