import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const Sheet = React.forwardRef(({ open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80">
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6 shadow-lg">
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
});
Sheet.displayName = 'Sheet';

const SheetContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('h-full', className)} {...props}>
    {children}
  </div>
));
SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
));
SheetHeader.displayName = 'SheetHeader';

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = 'SheetDescription';

const SheetTrigger = React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp
      ref={ref}
      className={cn('', className)}
      onClick={() => props.onClick?.()}
      {...props}
    >
      {children}
    </Comp>
  );
});
SheetTrigger.displayName = 'SheetTrigger';

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger };