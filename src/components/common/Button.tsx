import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant,
  size?: ButtonSize,
  className?: string,
  style?: React.CSSProperties,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  children: React.ReactNode,
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, style, onClick, children, disabled }, ref) => {
    const classes = clsx(
      'flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer',
      {
        'bg-gray-600 text-white hover:bg-gray-700': variant === 'primary',
        'bg-white text-gray-700 hover:bg-gray-100 border border-gray-600': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500': variant === 'warning',
        'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500': variant === 'success',
      },
      {
        'text-xs': size === 'sm',
        'text-sm': size === 'md',
        'text-base': size === 'lg',
      },
      {
        'opacity-50 cursor-not-allowed': disabled,
      },
      className
    );

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
)


export default Button;

