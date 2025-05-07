import React, { forwardRef, ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
}

export function WhiteCard({ children }: CardProps) {
    return <div className="bg-white rounded-md shadow p-4 inline-block">{children}</div>;
}

export const BlueCard = forwardRef<HTMLDivElement, CardProps>(({ children }, ref) => (
    <div
        ref={ref}
        className="bg-[#187bcd] bg-opacity-15 rounded-md shadow p-4 inline-block w-full mb-4"
    >
        {children}
    </div>
));

BlueCard.displayName = 'BlueCard';
