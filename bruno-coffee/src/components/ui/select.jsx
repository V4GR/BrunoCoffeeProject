import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ 
  children, 
  className,
  value,
  onValueChange,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-primary-gold/30 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  );
});
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>
    {children}
  </div>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => (
  <span ref={ref} className={cn('block truncate', className)} {...props}>
    {props.children || placeholder}
  </span>
));
SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md', className)} {...props}>
    <div className="p-1">
      {children}
    </div>
  </div>
));
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <option
    ref={ref}
    value={value}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </option>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };