import React, { useState } from 'react';
import axios from 'axios';
import { AIModelContentTable } from './AIModelContentTable';
import { Modal } from '../modals/Modal';
import { validationRange, optionalValues } from '../validation/data';

const imputeURL = process.env.REACT_APP_imputeURL as string;
const binaryClassificationURL = process.env.REACT_APP_binaryClassificationURL as string;

if (!imputeURL || !binaryClassificationURL) {
    throw new Error("One or more environment variables are not defined.");
}
interface AIModelContentProps {
    setLoading: (bool: boolean) => void;
    setErrorOccurred: (bool: boolean) => void;
    setSubmitStatus: (bool: boolean) => void;
    setIsSGA: (bool: boolean) => void;
}

const validateFormData = (formData: Record<string, any>, requiredFields: string[]): boolean => {
    const missingFields = requiredFields.filter((field) => formData[field] === undefined);
    if (missingFields.length > 0) {
        console.log(`Missing required fields: ${missingFields.join(', ')}`);
        return false;
    }
    return true;
};

const validateFeatureInRange = (
    formData: Record<string, any>,
    featureName: string,
    min: number,
    max: number,
): boolean => {
    const value = formData[featureName];
    if (optionalValues.includes(featureName)) {
        if (value === undefined) {
            return true;
        }
    }
    if (value < min || value > max) {
        console.log(
            `Validation error: ${featureName} value (${value}) is out of range. Expected between ${min} and ${max}.`,
        );
        return false;
    }
    return true;
};

export function AIModelContent({
    setLoading,
    setErrorOccurred,
    setSubmitStatus,
    setIsSGA,
}: AIModelContentProps) {
    const [checkRequiredFieldModal, setCheckRequiredFieldModal] = useState(false);
    const [valueError, setValueError] = useState('');
    const [checkValueErrorModal, setCheckValueErrorModal] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleFormSubmit = async () => {
        // Start loading
        setLoading(true);

        try {
            setSubmitStatus(true);

            // Validation Check, ensure required fields are filled in
            const requiredFields = [
                'MaternalAge',
                'Gender',
                'EstimatedFetalWeight',
                'FemurLength',
                'GestationalAge',
                'HeadCircumference',
                'AbdominalCircumference',
            ];
            if (validateFormData(formData, requiredFields) === false) {
                setCheckRequiredFieldModal(true);
                setTimeout(() => {
                    setCheckRequiredFieldModal(false);
                }, 5000);
                setErrorOccurred(true);
                console.log('Required fields are incomplete. Please fill them in.');
                return;
            }

            // Validation Check, ensure the entered amount is in logical range
            let validation = true;
            Object.entries(validationRange).forEach(([key, [label, min, max]]) => {
                if (!validateFeatureInRange(formData, key, Number(min), Number(max))) {
                    validation = false;
                    setValueError(label.toString());
                    setCheckValueErrorModal(true);

                    // Use a timeout to close the modal after 3 seconds
                    setTimeout(() => {
                        setCheckValueErrorModal(false);
                    }, 3000);
                }
            });

            if (!validation) {
                console.log('Validation failed. Please check the input values.');
                setErrorOccurred(true);
                return;
            }

            const predefinedKeys = [
                'EssentialHypertension',
                'GestationalDiabetes',
                'PregestationalDiabetes',
                'PregnancyInducedHypertension',
                'Smoking',
            ];

            Object.keys(formData).forEach((key) => {
                if (predefinedKeys.includes(key) && formData[key] === '') {
                    formData[key] = 0;
                } else if (predefinedKeys.includes(key) && formData[key] === 'false') {
                    formData[key] = 0;
                } else if (predefinedKeys.includes(key) && formData[key] === 'true') {
                    formData[key] = 1;
                }
            });


            // Impute those nan data and put it back into the dict
            const response = await axios.post(imputeURL, formData);

            const predictionResponse = await axios.post(binaryClassificationURL, response.data);
            if (predictionResponse.data === 0) {
                setIsSGA(false);
            } else {
                setIsSGA(true);
            }

            setErrorOccurred(false)
        } catch (error) {
            setErrorOccurred(true);
            console.log('Error occurred while imputing data: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex flex-col rounded-md p-4 bg-blue-900 bg-opacity-35 rounded-md shadow inline-block w-full mb-4"
        >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4 pl-2">
                {/* Title */}
                <h2 className="text-4xl w-full font-extrabold text-white">Fetal Information</h2>
            </div>

            {/* Scrollable Table Section */}
            <div className="overflow-auto w-full h-full">
                <AIModelContentTable
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
            <div className="flex flex-row mt-6 mb-2 justify-center">
                <button
                    type="button"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-32 py-4
                            transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-purple-600 hover:to-blue-600 
                            hover:shadow-lg font-bold"
                    onClick={handleFormSubmit}
                >
                    Get Prediction
                </button>
            </div>

            <Modal
                isOpen={checkRequiredFieldModal}
                onClose={() => setCheckRequiredFieldModal(false)}
            >
                <h2 className="text-xl font-semibold mb-4">Required Fields Incomplete</h2>
                <p className="mb-4">
                    <strong>
                        Please ensure that the Maternal Age, Gender, Estimated Fetal Weight, Femur Length,
                        Gestational Age, Head Circumference and Abdominal Circumference are filled.
                    </strong>
                </p>
            </Modal>

            <Modal
                isOpen={checkValueErrorModal}
                onClose={() => setCheckValueErrorModal(false)}
            >
                <h2 className="text-xl font-semibold mb-4">Error with {valueError}</h2>
                <p className="mb-4">
                    <strong>The value is illogical and out of range, please check again.</strong>
                </p>
            </Modal>
        </div>
    );
}
