import React, { useState } from 'react';
import { dataTemplate } from '../mockdata/dataTemplate';

interface AIModelContentTableProps {
    formData: Record<string, any>;
    setFormData: (patientData: Record<string, any>) => void;
}

export function AIModelContentTable({ formData, setFormData }: AIModelContentTableProps) {
    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { id, value } = e.target;
        setFormData((prev: any) => {
            const updatedFormData = {
                ...prev,
                [id]: value,
            };
            return updatedFormData;
        });
    };

    const compulsoryFields = [
        'Gender',
        'MaternalAge',
        'HeadCircumference',
        'AbdominalCircumference',
        'FemurLength',
        'GestationalAge',
        'EstimatedFetalWeight',
    ];

    const trueFalseFields = [
        'LastPregnancySga',
        'LastPregnancyFgr',
        'LastPregnancyNormal',
        'PreviousFailedPregnancy',
        'HighRiskPretermPreeclampsia',
        'PregnancyInducedHypertension',
        'EssentialHypertension',
        'PregestationalDiabetes',
        'GestationalDiabetes',
        'Smoking',
    ];

    const dropdownFields = {
        Gender: ['Male', 'Female'],
        PlacentaSite: [
            'Anterior Placenta',
            'Fundal Placenta',
            'Lateral Placenta',
            'Placenta Previa',
            'Posterior Placenta',
        ],
        AmnioticFluid: ['Oligohydramnios', 'Normal', 'Polyhydramnios'],
    };

    const renderInputField = (key: string) => {
        if (trueFalseFields.includes(key)) {
            return (
                <select
                    id={key}
                    value={formData[key] || 'unknown'}
                    onChange={(e) => handleInputChange(e)}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            );
        }

        if (dropdownFields[key as keyof typeof dropdownFields]) {
            return (
                <select
                    id={key}
                    value={formData[key] || ''}
                    onChange={(e) => handleInputChange(e)}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select</option>
                    {dropdownFields[key as keyof typeof dropdownFields].map((option: string) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type="text"
                id={key}
                value={formData[key]}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                placeholder={compulsoryFields.includes(key) ? 'Enter value (required)' : 'Optional'}
            />
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-2">
            {Object.keys(dataTemplate).map((key) => (
                <div
                    key={key}
                    className="flex flex-col justify-between"
                >
                    <label
                        htmlFor={key}
                        className="text-sm font-semibold mb-1 capitalize break-words"
                    >
                        {key.replace(/([A-Z])/g, ' $1')}
                        {compulsoryFields.includes(key) && ' *'}
                    </label>
                    {renderInputField(key)}
                </div>
            ))}
        </div>
    );
}
