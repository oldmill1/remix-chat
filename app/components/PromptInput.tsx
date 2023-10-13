import React from 'react';
import type { IPrompt } from '~/types';

function PromptInput({
  prompt,
  index,
  promptRefs,
}: {
  prompt: IPrompt;
  index: number;
  promptRefs: React.MutableRefObject<
    (React.RefObject<HTMLInputElement> | null)[]
  >;
}) {
  const [width, setWidth] = React.useState(100);
  const [charsTyped, setCharsTyped] = React.useState(0);

  // run some code every time charsTyped changes
  React.useEffect(() => {
    let newWidth = 100;
    if (charsTyped > 10) {
      newWidth += 10 * (Math.floor(charsTyped / 10) - 1);
    }
    if (newWidth > 500) {
      newWidth = 500;
    }
    setWidth(newWidth);
  }, [charsTyped]);
  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: `${prompt.x}px`,
        top: `${prompt.y}px`,
      }}
    >
      <input
        style={{ width: `${width}px` }}
        type='text'
        ref={promptRefs.current[index]}
        autoFocus
        onChange={(e) => {
          const inputLength = e.target.value.length;
          setCharsTyped(inputLength);
          if (inputLength > 49) {
            console.log('switching to big view');
          }
        }}
      />
    </div>
  );
}

export default PromptInput;
