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
  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: `${prompt.x}px`,
        top: `${prompt.y}px`,
        width: `100px`,
      }}
    >
      <input type='text' ref={promptRefs.current[index]} autoFocus />
    </div>
  );
}

export default PromptInput;
