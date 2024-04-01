import { cn } from '@/utils/cn';
import React from 'react';

const ToolbarItemButton = React.forwardRef(
    ({ isFocused, className, ...props }: React.HTMLAttributes<HTMLButtonElement> & {
        isFocused: boolean;
    }, ref) => {
        return (
            <button
                className={
                    cn(
                        'w-12 h-12 rounded flex justify-center items-center cursor-pointer text-white',
                        isFocused ? 'bg-gray-800' : 'bg-opacity-0',
                        className
                    )
                }
                {...props}
                ref={ref as React.RefObject<HTMLButtonElement>}
            >
            </button>
        );
    });

export default ToolbarItemButton;