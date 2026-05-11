'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function RangeSlider({
  min = 0,
  max = 5000,
  step = 100,
  value,
  onChange,
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleValueChange = (newValue: number[]) => {
    setLocalValue([newValue[0], newValue[1]]);
  };

  const handleValueCommit = () => {
    onChange(localValue);
  };

  return (
    <div className="px-2">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={localValue}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className="bg-black relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-yellow-400 rounded-full h-full" />
        </Slider.Track>
        {localValue.map((_, index) => (
          <Slider.Thumb
            key={index}
            className="block w-5 h-5 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#0A0A0A] rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            aria-label={index === 0 ? 'Min price' : 'Max price'}
          />
        ))}
      </Slider.Root>
      <div className="flex justify-between mt-2">
        <span className="font-mono text-[13px] text-black">
          ₹{localValue[0].toLocaleString()}
        </span>
        <span className="font-mono text-[13px] text-black">
          ₹{localValue[1].toLocaleString()}
        </span>
      </div>
    </div>
  );
}
