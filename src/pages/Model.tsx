import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BlueCard } from '../components/Card';
import { Modal } from '../modals/Modal';
import { AIModelContent } from '../components/AIModelContent';
import { CreatePatientModal } from '../components/CreateNewPatient';
import InfoIcon from '../assets/InfoIcon.svg';
import ExpandIcon from '../assets/ExpandIcon.svg';
import MaleUserIcon from '../assets/MaleUserIcon.svg';
import { getSingleMotherURL, postNewMotherURL } from '../constants';

export function AimodelPage() {
    const firstCardRef = useRef<HTMLDivElement | null>(null);
    const secondCardRef = useRef<HTMLDivElement | null>(null);
    const [combinedHeight, setCombinedHeight] = useState(0);

    const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);
    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientHeight, setPatientHeight] = useState('');
    const [patientWeight, setPatientWeight] = useState('');
    const [patientHospital, setPatientHospital] = useState('');
    const [patientSmoking, setPatientSmoking] = useState(false);
    const [patientPregestationalLDM, setPatientPregestationalLDM] = useState(false);
    const [patientGestationalLDM, setPatientGestationalLDM] = useState(false);
    const [patientPregnancyInducedHypertension, setPatientPregnancyInducedHypertension] = useState(false);
    const [patientHighRiskPreeclampsia, setPatientHighRiskPreeclampsia] = useState(false);
    const [patientPreviouslyFailedPregnancy, setPatientPreviouslyFailedPregnancy] = useState(false);

    useEffect(() => {
        // Calculate the combined height of both BlueCard elements
        const firstCardHeight = firstCardRef.current?.offsetHeight || 0;
        const secondCardHeight = secondCardRef.current?.offsetHeight || 0;
        // Since blue card has mb-2 in between, 14 pixels have to be added
        setCombinedHeight(firstCardHeight + secondCardHeight + 14);
    }, [isSuccessful]);

    const handleRetrievePatientId = async (inputPatientID: string) => {
        try {
            const response = await axios.get(`${getSingleMotherURL}/${inputPatientID}`);
            setPatientName(response.data.name);
            setPatientAge(response.data.age);
            setPatientHeight(response.data.height);
            setPatientWeight(response.data.weight);
            setPatientHospital(response.data.hospital);
            setPatientSmoking(response.data.Smoking);
            setPatientPregestationalLDM(response.data.PregestationalLDM);
            setPatientGestationalLDM(response.data.GestationalLDM);
            setPatientPregnancyInducedHypertension(response.data.PregnancyInducedHypertension);
            setPatientHighRiskPreeclampsia(response.data.HighRiskPreeclampsia);
            setPatientPreviouslyFailedPregnancy(response.data.PreviouslyFailedPregnancy);
            setIsSuccessful(true);
        } catch (error) {
            setIsSuccessful(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [loading, setLoading] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [isSGA, setIsSGA] = useState(true);

    const handleSaveNewPatient = async (patientData: Record<string, any>) => {
        // Save the new patient data (e.g., API call or update state)
        try {
            const newPatient = {
                name: patientData.name,
                age: Number(patientData.age),
                height: Number(patientData.height),
                weight: Number(patientData.weight),
                hospital: patientData.hospital,
                PreviouslyFailedPregnancy: patientData.failedPregnancyCount,
                HighRiskPreeclampsia: patientData.highRiskPreeclampsia,
                PregnancyInducedHypertension: patientData.pregnancyHypertension,
                PregestationalLDM: patientData.pregestationalLDM,
                GestationalLDM: patientData.gestationalLDM,
                Smoking: patientData.doesSmoke,
            };
            const response = await axios.post(postNewMotherURL, newPatient);
        } catch (error) {
            console.log(error);
        }
    };

    const resultRow = () => {
        if (loading) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="text-white text-lg">Processing...</div>
                </div>
            );
        }

        if (!submitStatus) {
            return (
                <div className="flex flex-col w-full mt-4">
                    <div className="flex items-center bg-sky-500 px-4 rounded-lg">
                        <h1 className="text-white text-lg font-md m-2">Please submit fetal information to get your prediction results.</h1>
                    </div>
                </div>
            )
        }

        if (errorOccurred) {
            return (
                <div className="flex flex-col w-full mt-4">
                    <div className="flex items-center bg-red-500 px-4 rounded-lg">
                        <h1 className="text-white text-lg font-md m-2">An error occurred. Please try again.</h1>
                    </div>
                </div>
            );
        }

        if (!errorOccurred && submitStatus) {
            return (
                <div className="flex flex-col w-full mt-4">
                    {isSGA ? (
                        <div>
                            <div className="flex items-center bg-red-500 px-4 rounded-t-lg">
                                <h1 className="text-white text-lg font-md m-2">
                                    It is predicted to be a Small-for-Gestational Age (SGA) baby.
                                </h1>
                            </div>
                            <div className="flex flex-col items-left bg-white px-4 rounded-t-lg mb-4">
                                <p className="my-2 text-black">Guidelines from ROCG</p>
                                <p className="underline">Fetal Growth Scan - Carry out every 2 weeks</p>
                                <p className="underline">Umbilical Artery Doppler - Carry out every 2 weeks</p>
                                <p className="underline">
                                    Consider Delivery - If static growth over 3 weeks, for period more than 34 weeks
                                </p>
                                <p className="underline">MCA Doppler - Carry out every 2 weeks (Only after 32 weeks)</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center bg-green-500 px-4 rounded-t-lg">
                                <h1 className="text-white text-lg font-md m-2">
                                    It is predicted to be an Appropriate-for-Gestational Age (AGA) baby.
                                </h1>
                            </div>
                            <div className="flex flex-col items-left bg-white px-4 rounded-t-lg mb-4">
                                <p className="my-2 text-black">General Advice</p>
                                <p className="underline">Maintain balanced nutrition to support fetal development.</p>
                                <p className="underline">
                                    Encourage maternal hydration, appropriate physical activity, and regular prenatal
                                    care.
                                </p>
                                <p className="underline">Avoid smoking, alcohol, or substance use during pregnancy.</p>
                                <p className="underline">Consult doctors immediately if there are any abnormalities.</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };
    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-full">
                <div className="flex space-y-4">
                    <BlueCard ref={firstCardRef}>
                        <div className="flex flex-col items-center mb-2">
                            <h1 className="text-lg font-semibold mx-2">A DOMAIN-GENERALIZED PREDICTIVE MODEL FOR IDENTIFYING SMALL FOR GESTATIONAL AGE (SGA) INFANTS ACROSS MULTI-CENTER COHORTS</h1>
                            <p className='text-md mx-2 text-center'>By integrating feature-imputation techniques and a unified training strategy,
                                our model effectively combines the strengths of large feature sets with limited data and smaller feature sets with larger datasets,
                                addressing the challenge of data scarcity in healthcare,
                                resulting in improvement in performance with low-volume data
                            </p>
                        </div>
                    </BlueCard>
                </div>
                <AIModelContent
                    setLoading={setLoading}
                    setErrorOccurred={setErrorOccurred}
                    setSubmitStatus={setSubmitStatus}
                    setIsSGA={setIsSGA}
                    height={combinedHeight}
                />
            </div>
            {resultRow()}
        </div>
    );
}
