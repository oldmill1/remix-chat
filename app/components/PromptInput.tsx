import React from 'react';
import type { IPrompt } from '~/types';

function PromptInput({
  prompt,
  index,
  setSelectedId,
}: {
  prompt: IPrompt;
  index: number;
  setSelectedId: (id: string | null) => void;
}) {
  console.log({ prompt });
  const [left, setLeft] = React.useState(prompt.x);
  const [top, setTop] = React.useState(prompt.y);
  const [origin, setOrigin] = React.useState<{ x: number; y: number } | null>(
    null,
  );
  const [width, setWidth] = React.useState(100);
  const [charsTyped, setCharsTyped] = React.useState(0);

  React.useEffect(() => {
    setLeft(prompt.x);
    setTop(prompt.y);
  }, [prompt.x, prompt.y]);

  React.useEffect(() => {
    let newWidth = 100;
    if (charsTyped > 10) {
      newWidth += 10 * (Math.floor(charsTyped / 10) - 1);
    }
    if (newWidth > 500) {
      newWidth = 500;
    }
    setWidth(newWidth);
    // if (charsTyped > 49) {
    //   switchToFullScreen();
    // }
  }, [charsTyped]);
  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <input
        style={{ width: `${width}px` }}
        type='text'
        autoFocus
        onMouseDown={(e) => {
          e.stopPropagation();
          setSelectedId(prompt.id);
          setOrigin({
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          setSelectedId(null);
          setOrigin(null);
        }}
        onMouseMove={(e) => {
          e.stopPropagation();
          const startX = origin?.x;
          const startY = origin?.y;
          const currentX = e.clientX;
          const currentY = e.clientY;

          if (startX && startY) {
            const distanceX = currentX - startX;
            const distanceY = currentY - startY;
            const newLeft = left + distanceX;
            const newTop = top + distanceY;
            setLeft(newLeft);
            setTop(newTop);

            // Update the origin to the new position for the next calculation
            setOrigin({
              x: e.clientX,
              y: e.clientY,
            });
          }
        }}
        onChange={(e) => {
          // Set the width of the input based
          // on the length of the text
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
