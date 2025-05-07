import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import ExpandIcon from '../assets/ExpandIcon.svg';
import { AIModelContentTable } from './AIModelContentTable';
import { Modal } from '../modals/Modal';
import { validationRange, optionalValues } from '../validation/data';
import { getSingleMotherURL, postNewScanURL, imputeURL, binaryClassificationURL } from '../constants';

interface AIModelContentProps {
    setLoading: (bool: boolean) => void;
    setErrorOccurred: (bool: boolean) => void;
    setSubmitStatus: (bool: boolean) => void;
    setIsSGA: (bool: boolean) => void;
    height: number;
}

const checkMotherExists = async (motherId: string) => {
    try {
        const response = await axios.get(`${getSingleMotherURL}/${motherId}`);
        return true;
    } catch (error) {
        console.log('Error occured while checking mother exists: ', error);
        return false;
    }
};

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
    const [isExpandModalOpen, setExpandModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [checkMotherModal, setCheckMotherModal] = useState(false);
    const [checkRequiredFieldModal, setCheckRequiredFieldModal] = useState(false);
    const [valueError, setValueError] = useState('');
    const [checkValueErrorModal, setCheckValueErrorModal] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isSaved, setIsSaved] = useState(false);

    const handleExpandTable = () => setExpandModalOpen(true);

    const handleCloseCreateModal = () => {
        if (Object.keys(formData).length > 0 && !isSaved) {
            const confirmExit = window.confirm(
                'This record will not be saved as it is not completed. Are you sure you want to close?',
            );
            if (!confirmExit) return;
        }
        setCreateModalOpen(false);
        // setFormData({});
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = async () => {
        // Start loading
        setLoading(true);

        try {
            // Placeholder for submit logic
            setIsSaved(true);
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

            console.log('Finalized: ', formData);

            // Impute those nan data and put it back into the dict
            const response = await axios.post(imputeURL, formData);
            console.log('Response received after imputing: ', response.data);

            const motherPatient = {
                age: Number(response.data['MaternalAge']),
                height: Number(response.data['MaternalHeight']),
                weight: Number(response.data['MaternalWeight']),
                PreviouslyFailedPregnancy: response.data['PreviousFailedPregnancy'],
                HighRiskPreeclampsia: response.data['HighRiskPretermPreeclampsia'],
                PregnancyInducedHypertension: response.data['PregnancyInducedHypertension'],
                PregestationalLDM: response.data['PregestationalDiabetes'],
                GestationalLDM: response.data['GestationalDiabetes'],
                Smoking: response.data['Smoking'],
            };

            const predictionResponse = await axios.post(binaryClassificationURL, response.data);
            console.log('Prediction Response: ', predictionResponse.data);
            if (predictionResponse.data === 0) {
                setIsSGA(false);
            } else {
                setIsSGA(true);
            }

            const scans = {
                gender: response.data['Gender'] === 'male' ? 0 : 1,
                ga: Number(response.data['GestationalAge']),
                bpd: Number(response.data['BiparietalDiameter']),
                hc: Number(response.data['HeadCircumference']),
                ac: Number(response.data['AbdominalCircumference']),
                fl: Number(response.data['FemurLength']),
                afi: Number(response.data['AmnioticFluidIndex']),
                cpr: Number(response.data['CerebroplacentalRatio']),
                psv: Number(response.data['MiddleCerebralArteryPeakSystolicVelocity']),
                efw: Number(response.data['EstimatedFetalWeight']),
                ute_ari: Number(response.data['UterineArteryResistanceIndex']),
                ute_api: Number(response.data['UterineArteryPulsatilityIndex']),
                umb_api: Number(response.data['UmbilicalArterialPulsatilityIndex']),
                placenta_site: response.data['PlacentaSite'],
                af: response.data['AmnioticFluid'],
                sga: predictionResponse.data,
            };

            const scansResponse = await axios.post(`${postNewScanURL}`, scans);
            console.log('Scans Response: ', scansResponse);
        } catch (error) {
            setErrorOccurred(true);
            console.log('Error occurred why imputing data: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex flex-col bg-white rounded-md shadow p-4"
        >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                {/* Title */}
                <h2 className="text-lg font-semibold">Fetal Information</h2>

                {/* Button and Icons */}
                <div className="flex items-center space-x-2">
                    <button
                        className="p-2"
                        type="button"
                        onClick={handleExpandTable}
                    >
                        <img
                            src={ExpandIcon}
                            alt="Expand Icon"
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>

            {/* Scrollable Table Section */}
            <div className="overflow-auto w-full h-full">
                <AIModelContentTable
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
            <div className="flex flex-row mt-2 justify-end">
                <button
                    type="button"
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 border-2 border-solid border-black"
                    onClick={handleFormSubmit}
                >
                    Submit
                </button>
                <button
                    type="button"
                    className="text-gray-700 rounded-lg px-4 py-2 border-2 border-solid border-black mx-2"
                    onClick={handleCloseCreateModal}
                >
                    Cancel
                </button>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isExpandModalOpen}
                onClose={() => setExpandModalOpen(false)}
            >
                <div className="overflow-auto max-h-screen">
                    <AIModelContentTable
                        formData={formData}
                        setFormData={setFormData}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Create New Patient Record</h2>
                    <form className="space-y-4">
                        <input
                            type="text"
                            name="patientName"
                            placeholder="Patient Name"
                            onChange={handleFormChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            onChange={handleFormChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                        {/* Additional form fields */}
                    </form>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-blue-500 text-white rounded px-4 py-2"
                            onClick={handleFormSubmit}
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            className="text-gray-700"
                            onClick={handleCloseCreateModal}
                        >
                            Cancel
                        </button>
                    </div>
                    {isSaved && <p className="mt-2 text-green-500">Record successfully saved!</p>}
                </div>
            </Modal>

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
