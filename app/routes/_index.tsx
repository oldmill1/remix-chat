import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import React from 'react';
import PromptInput from '~/components/PromptInput';
import { useLoaderData } from '@remix-run/react';
import { getPrompts, updatePrompt } from '~/data';
import {
  promptReducer,
  addPrompt,
  updatePromptPosition,
} from '~/store/reducers';
import invariant from 'tiny-invariant';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  console.log('Action function called');
  invariant(params.promptId, 'Missing promptId param');
  const formData = await request.formData();
  const x = Number(formData.get('x'));
  const y = Number(formData.get('y'));

  if (isNaN(x) || isNaN(y)) {
    return new Response('Invalid x or y', { status: 400 });
  }

  await updatePrompt(params.promptId, { x, y });
  return new Response(null, { status: 200 });
};

export const loader = async () => {
  const rawPrompts = await getPrompts();
  return json({ rawPrompts });
};

export default function Index() {
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

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const x = e.clientX;
    const y = e.clientY;
    //createPrompt(x, y);
  }
  console.log({ prompts, selectedId });
  return (
    <div onClick={handleClick} className='universe' id='universe'>
      {isFullScreen && (
        <div className='full-screen' data-testid='full-screen'>
          <p>Something</p>
        </div>
      )}
      <button
        onClick={async () => {
          try {
            const response = await fetch('/', {
              method: 'POST',
              body: new URLSearchParams({
                promptId: '8f112fb7-e55b-4bb6-b969-bdcbdc7f1905',
                x: '100',
                y: '100',
              }),
            });

            if (response.ok) {
              dispatch(
                updatePromptPosition({
                  id: '8f112fb7-e55b-4bb6-b969-bdcbdc7f1905',
                  x: 1,
                  y: 1,
                }),
              );
            } else {
              console.error('Failed to update prompt position');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }}
      >
        Hello
      </button>
      This way, the dispatch will only be executed if the fetch request returns
      a successful response (HTTP status in the range 200-299).
      {prompts &&
        !isFullScreen &&
        prompts.map((prompt, index) => (
          <PromptInput
            key={index}
            index={index}
            prompt={prompt}
            setSelectedId={setSelectedId}
          />
        ))}
    </div>
  );
}
