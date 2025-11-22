import React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? 'span' : 'button';
  
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-primary-dark text-primary-cream hover:bg-neutral-charcoal',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-primary-gold/30 bg-transparent hover:bg-primary-gold/10 text-primary-dark',
    secondary: 'bg-primary-gold/20 text-primary-dark hover:bg-primary-gold/30',
    ghost: 'hover:bg-primary-gold/10 hover:text-primary-dark',
    link: 'underline-offset-4 hover:underline text-primary-dark'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  };

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };