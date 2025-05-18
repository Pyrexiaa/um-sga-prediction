import React, { useState } from 'react';
import { BlueCard } from '../components/Card';
import { AIModelContent } from '../components/AIModelContent';

export function AimodelPage() {
    const [loading, setLoading] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [isSGA, setIsSGA] = useState(true);

    const resultRow = () => {
        console.log("Error occurred: ", errorOccurred);
        if (loading) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="text-white text-lg">Processing... It might take up to few minutes.</div>
                </div>
            );
        }

        if (!submitStatus) {
            return (
                <div className="flex flex-col w-full mt-2"/>
            )
        }

        if (errorOccurred) {
            return (
                <div className="flex flex-col w-full mt-2">
                    <div className="flex items-center bg-red-500 px-4 rounded-lg">
                        <h1 className="text-white text-lg font-md m-2">An error occurred. Please try again.</h1>
                    </div>
                </div>
            );
        }

        if (!errorOccurred && submitStatus) {
            return (
                <div className="flex flex-col w-full mt-2">
                    {isSGA ? (
                        <div>
                            <div className="flex items-center bg-red-500 px-4 rounded-lg">
                                <h1 className="text-white text-lg font-semibold m-2">
                                    It is predicted to be a Small-for-Gestational-Age (SGA) baby.
                                </h1>
                            </div>
                            <div className="flex flex-col items-left px-4 rounded-lg bg-red-900 bg-opacity-50 shadow">
                                <p className="my-2 text-white font-bold">Guidelines from ROCG</p>
                                <table className="w-full text-white">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold">Fetal Growth Scan</td>
                                            <td className="py-3">Carry out every 2 weeks</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold">Umbilical Artery Doppler</td>
                                            <td className="py-3">Carry out every 2 weeks</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold">Consider Delivery</td>
                                            <td className="py-3">If static growth over 3 weeks, for period more than 34 weeks</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold">MCA Doppler</td>
                                            <td className="py-3">Carry out every 2 weeks (Only after 32 weeks)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center bg-green-500 px-4 rounded-lg">
                                <h1 className="text-white text-lg font-semibold m-2">
                                It is predicted to be an Appropriate-for-Gestational-Age (AGA) baby.
                                </h1>
                            </div>
                            <div className="flex flex-col items-left px-4 rounded-lg bg-green-900 bg-opacity-50 shadow">
                                <p className="my-2 text-white font-bold">Pieces of General Advice</p>
                                <table className="w-full text-white">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold">First Advice</td>
                                            <td className="py-3">Maintain balanced nutrition to support fetal development</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold">Second Advice</td>
                                            <td className="py-3">Encourage maternal hydration, appropriate physical activity, and regular prenatal
                                            care</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold">Third Advice</td>
                                            <td className="py-3">Avoid smoking, alcohol, or substance use during pregnancy</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold">Fourth Advice</td>
                                            <td className="py-3">Consult doctors immediately if there are any abnormalities</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                    <BlueCard>
                        <div className="flex flex-col items-center mb-2">
                            
                            <h1 className="text-7xl w-full text-center text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 p-2">A DOMAIN-GENERALIZED PREDICTIVE MODEL FOR IDENTIFYING SMALL-FOR-GESTATIONAL-AGE (SGA) INFANTS ACROSS MULTI-CENTER COHORTS</h1>
                            <p className='text-lg font-bold mx-2 text-white text-center my-4'>By integrating feature-imputation techniques and a unified training strategy,
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
                />
            </div>
            {resultRow()}
        </div>
    );
}
