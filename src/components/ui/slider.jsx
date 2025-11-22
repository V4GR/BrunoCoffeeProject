import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ 
  className, 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    onValueChange?.([parseInt(e.target.value)]);
  };

  return (
    <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value?.[0] || min}
        onChange={handleChange}
        className="relative flex w-full cursor-pointer appearance-none rounded-full h-2 bg-gray-200 outline-none"
        style={{
          background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((value?.[0] - min) / (max - min)) * 100}%, #E5E7EB ${((value?.[0] - min) / (max - min)) * 100}%, #E5E7EB 100%)`
        }}
        {...props}
      />
    </div>
  );
});
Slider.displayName = 'Slider';

export { Slider };