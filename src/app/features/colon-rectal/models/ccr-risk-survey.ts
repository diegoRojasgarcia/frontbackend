export interface CCRRiskSurveyGeneral {
    idPatient: number;
    cAbdominal: number;
    paSystolic: number;
    paDiastolic: number;
    weight: number;
    height: number;
    imc: number;
    regularMedications: boolean;
    reasonMedicines?: string;
    anticoagulants: boolean;
    wichAnticoagulants?: boolean;
    colonoscopyRejection: boolean;
    colonoscopyRejectionSignature?: boolean;
    signConsent?: boolean;
    instructiveTsdo?: boolean;
}

export interface CCRRiskSurveyPathologies {
    idPatient: number;
    arterialHypertension: boolean;
    diabetes: boolean;
    epilepsy: boolean;
    gastriculcer: boolean;
    hypoHyperThyroidism: boolean;
    operated: boolean;
    operationReason?: string;
    cancer: boolean;
    typeCancer?: string;
    cancerAge?: number;
    polypsColonRectum: boolean;
    crohn: boolean;
    ulcerativeColitis: boolean;
    moreThanOneSymptom: boolean;
}

export interface CCRRiskSurveyHabits {
    idPatient: number;
    smokes: number;
    numberCigarettes?: number;
    yearsSmoking?: number;
    eatCerealFiber: boolean;
    drinkAlcohol: boolean;
    quantityAlcohol?: number;
    physicalActivity: boolean;
    threeFruits: boolean;
    friedFoods: boolean;
}

export interface CCRRiskSurveyFamily {
    idPatient: number;
    familyMemberCancer: boolean;
    moreThanThreeFamiliarCancer: boolean;
    familiarWithCancerColorectal: boolean;
    wichFamiliarWithCancerColorectal: string;
}

export interface CCRRiskSurveyFamilyCancer {
    idRiskSurveyFamilyCancer: number;
    idPatient: number;
    familyMember: string;
    age: number;
    cancer: string;
}
