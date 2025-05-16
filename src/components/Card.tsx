import React, { forwardRef, ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
}

export const BlueCard = forwardRef<HTMLDivElement, CardProps>(({ children }, ref) => (
    <div
        ref={ref}
        className="bg-blue-900 bg-opacity-25 rounded-md shadow p-4 inline-block w-full mb-4"
    >
        {children}
    </div>
));

BlueCard.displayName = 'BlueCard';
