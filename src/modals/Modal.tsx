import { useState } from 'react';
import cross from '../assets/cross.png';

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

// Example Modal Component (This can be moved to a separate file)
export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 m-24 w-full">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        type="button"
                    >
                        <img
                            src={cross}
                            alt="Cross Icon"
                        />
                    </button>
                </div>

                <div className="overflow-auto">{children}</div>
            </div>
        </div>
    );
}
