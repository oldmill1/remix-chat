import React from 'react';

interface Prompt {
  x: number;
  y: number;
}

function PromptInput({
  prompt,
  index,
  promptRefs,
}: {
  prompt: Prompt;
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
