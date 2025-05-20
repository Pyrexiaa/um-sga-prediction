import React from 'react';

interface AIModelContentTableProps {
    formData: Record<string, any>;
    setFormData: (patientData: Record<string, any>) => void;
}

export function AIModelContentTable({ formData, setFormData }: AIModelContentTableProps) {
    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { id, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [id]: value,
        }));
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

    const maternalFields = [
        'MaternalHeight',
        'MaternalWeight',
        'LastPregnancySga',
        'LastPregnancyFgr',
        'LastPregnancyNormal',
        'PreviousFailedPregnancy',
        'HighRiskPretermPreeclampsia',
        'PregestationalDiabetes',
        'GestationalDiabetes',
        'Smoking',
    ]

    const fetusFields = [
        'PlacentaSite',
        'BiparietalDiameter',
        'CerebroplacentalRatio',
        'AmnioticFluid',
        'UterineArteryResistanceIndex',
        'UterineArteryPulsatilityIndex',
        'UmbilicalArterialPulsatilityIndex',
        'MiddleCerebralArteryPeakSystolicVelocity'
    ]

    const fieldDisplayNameMap: Record<string, string> = {
        'Gender': 'Gender',
        'MaternalAge': 'Maternal Age',
        'HeadCircumference': 'Head Circumference (cm)',
        'AbdominalCircumference': 'Abdominal Circumference (cm)',
        'FemurLength': 'Femur Length (cm)',
        'GestationalAge': 'Gestational Age',
        'EstimatedFetalWeight': 'Estimated Fetal Weight (grams)',
        'MaternalHeight': 'Maternal Height (cm)',
        'MaternalWeight': 'Maternal Weight (kg)',
        'LastPregnancySga': 'Last Pregnancy SGA',
        'LastPregnancyFgr': 'Last Pregnancy FGR',
        'LastPregnancyNormal': 'Last Pregnancy Normal',
        'PreviousFailedPregnancy': 'Previous Failed Pregnancy',
        'HighRiskPretermPreeclampsia': 'High Risk Preterm Preeclampsia',
        'PregestationalDiabetes': 'Pregestational Diabetes',
        'GestationalDiabetes': 'Gestational Diabetes',
        'Smoking': 'Smoking',
        'PlacentaSite': 'Placenta Site',
        'BiparietalDiameter': 'Biparietal Diameter (mm)',
        'CerebroplacentalRatio': 'Cerebroplacental Ratio',
        'AmnioticFluid': 'Amniotic Fluid',
        'UterineArteryResistanceIndex': 'Uterine Artery Resistance Index',
        'UterineArteryPulsatilityIndex': 'Uterine Artery Pulsatility Index',
        'UmbilicalArterialPulsatilityIndex': 'Umbilical Arterial Pulsatility Index',
        'MiddleCerebralArteryPeakSystolicVelocity': 'Middle Cerebral Artery Peak Systolic Velocity (cm/s)',
    };

    const trueFalseFields = [
        'LastPregnancySga',
        'LastPregnancyFgr',
        'LastPregnancyNormal',
        'PreviousFailedPregnancy',
        'HighRiskPretermPreeclampsia',
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
                    value={formData[key] || ''}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select</option>
                    {dropdownFields[key as keyof typeof dropdownFields].map((option: string) => (
                        <option key={option} value={option}>
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
                value={formData[key] || ''}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                placeholder={compulsoryFields.includes(key) ? 'Enter value (required)' : 'Optional'}
            />
        );
    };

    const renderFields = (fields: string[], sectionTitle: string, bgColor: string) => (
        <div className={`p-4 rounded-md ${bgColor}`}>
            <h2 className="text-lg font-bold mb-2 text-white">{sectionTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fields.map((key) => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="text-sm font-semibold mb-1 break-words text-white">
                            {fieldDisplayNameMap[key] || key.replace(/([A-Z])/g, ' $1')}
                            {compulsoryFields.includes(key) && ' *'}
                        </label>
                        {renderInputField(key)}
                    </div>
                ))}
            </div>
        </div>
    );

    const dropdownKeys = Object.keys(dropdownFields);

    const getFieldGroupsByInputType = (fields: string[]) => {
        const rendered = new Set<string>();
        return {
            
            dropdown: fields.filter((key) => {
                if (dropdownKeys.includes(key) && !rendered.has(key)) {
                    rendered.add(key);
                    return true;
                }
                return false;
            }),
            text: fields.filter((key) => {
                if (
                    !trueFalseFields.includes(key) &&
                    !dropdownKeys.includes(key) &&
                    !rendered.has(key)
                ) {
                    rendered.add(key);
                    return true;
                }
                return false;
            }),
            trueFalse: fields.filter((key) => {
                if (trueFalseFields.includes(key) && !rendered.has(key)) {
                    rendered.add(key);
                    return true;
                }
                return false;
            }),
        };
    };
    
    const renderSection = (title: string, fields: string[], bgColor: string) => {
        const grouped = getFieldGroupsByInputType(fields);
        return (
            <div className={`flex flex-col gap-4 w-full ${bgColor} p-4 rounded-md`}>
                <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
                {grouped.dropdown.length > 0 &&
                    renderFields(grouped.dropdown, 'Dropdown Fields', 'bg-blue-900 bg-opacity-10')}
                {grouped.text.length > 0 &&
                    renderFields(grouped.text, 'Fill in the Blank', 'bg-blue-900 bg-opacity-10')}
                {grouped.trueFalse.length > 0 &&
                    renderFields(grouped.trueFalse, 'True/False Fields', 'bg-blue-900 bg-opacity-10')}
            </div>
        );
    };
    
    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col gap-6 w-full">
                {renderSection('Compulsory Clinical Measurements', compulsoryFields, 'bg-gradient-to-b from-purple-600 to-purple-500')}
                {renderSection('Maternal Health & History', maternalFields, 'bg-gradient-to-b from-purple-500 to-purple-400')}
                {renderSection('Fetal Biometry & Doppler Assessments', fetusFields, 'bg-gradient-to-b from-purple-400 to-purple-300')}
            </div>
        </div>
    );
}

