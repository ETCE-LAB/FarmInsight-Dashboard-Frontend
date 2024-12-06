import React, { useEffect, useRef, useState } from 'react';

interface DynamicFontTextProps {
  text: string;
  maxWidth: number;
  minFontSize?: number;
  maxFontSize?: number;
}

const DynamicFontText: React.FC<DynamicFontTextProps> = ({
  text,
  maxWidth,
  minFontSize = 12,
  maxFontSize = 24,
}) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const adjustFontSize = () => {
      const element = textRef.current;
      if (element) {
        let currentFontSize = maxFontSize;
        element.style.fontSize = `${currentFontSize}px`;

        // Decrease font size until it fits or reaches the minimum font size
        while (element.scrollWidth > maxWidth && currentFontSize > minFontSize) {
          currentFontSize -= 1;
          element.style.fontSize = `${currentFontSize}px`;
        }

        setFontSize(currentFontSize);
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);

    return () => {
      window.removeEventListener('resize', adjustFontSize);
    };
  }, [text, maxWidth, minFontSize, maxFontSize]);

  return (
    <span
      ref={textRef}
      style={{
        fontSize: `${fontSize}px`,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        maxWidth: `${maxWidth}px`,
        display: 'inline-flex',
         alignItems: 'center',
      }}
    >
      {text}
    </span>
  );
};

export default DynamicFontText;
