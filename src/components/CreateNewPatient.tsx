import React, { useState } from 'react';

interface CreatePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (patientData: Record<string, any>) => void;
}

export function CreatePatientModal({ isOpen, onClose, onSave }: CreatePatientModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        hospital: '',
        doesSmoke: false,
        gestationalLDM: false,
        pregestationalLDM: false,
        pregnancyHypertension: false,
        essentialHypertension: false,
        failedPregnancyCount: false,
        highRiskPreeclampsia: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as keyof typeof formData]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        console.log('Form Data: ', formData);
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">
                <h2 className="text-2xl font-bold mb-4">Create New Patient</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Form fields */}
                    {[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Age', name: 'age', type: 'number' },
                        { label: 'Height (cm)', name: 'height', type: 'number' },
                        { label: 'Weight (kg)', name: 'weight', type: 'number' },
                    ].map((field) => (
                        <div
                            key={field.name}
                            className="flex flex-col"
                        >
                            <label
                                htmlFor={field.name}
                                className="text-sm font-semibold mb-1"
                            >
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name as keyof typeof formData] as string}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2"
                            />
                        </div>
                    ))}
                    <div
                        key="hospital"
                        className="flex flex-col col-span-1 md:col-span-2"
                    >
                        <label
                            htmlFor="hospital"
                            className="text-sm font-semibold mb-1"
                        >
                            Hospital Name
                        </label>
                        <input
                            type="string"
                            name="hospital"
                            value={formData['hospital' as keyof typeof formData] as string}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2"
                        />
                    </div>
                    {[
                        { label: 'Does she smoke?', name: 'doesSmoke' },
                        { label: 'Does she have gestational LDM?', name: 'gestationalLDM' },
                        { label: 'Does she have pregestational LDM?', name: 'pregestationalLDM' },
                        { label: 'Does she have pregnancy-induced hypertension?', name: 'pregnancyHypertension' },
                        { label: 'Does she have essential hypertension?', name: 'essentialHypertension' },
                        { label: 'Does she have high-risk preeclampsia?', name: 'highRiskPreeclampsia' },
                        { label: 'Does she have failed pregnancy before?', name: 'failedPregnancyCount' },
                    ].map((field) => (
                        <div
                            key={field.name}
                            className="flex items-center"
                        >
                            <input
                                type="checkbox"
                                name={field.name}
                                checked={formData[field.name as keyof typeof formData] as boolean}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label
                                htmlFor={field.name}
                                className="text-sm font-semibold"
                            >
                                {field.label}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onClose}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleSubmit}
                        type="button"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
