import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost' | 'danger';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'default' && 'bg-white text-black hover:bg-zinc-200',
          variant === 'secondary' && 'bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800',
          variant === 'ghost' && 'text-zinc-300 hover:bg-zinc-900',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
