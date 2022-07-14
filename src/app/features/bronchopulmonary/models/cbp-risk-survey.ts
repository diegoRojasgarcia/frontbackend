export interface CBPRiskSurveyGeneral {
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

export interface CBPRiskSurveyPathologies {
    idPatient: number;
    arterialHypertension: boolean;
    diabetes: boolean;
    epilepsy: boolean;
    gastricUlcer: boolean;
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
    otro:boolean;
    otroreason?:string;
}

export interface CBPRiskSurveyHabits {
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

export interface CBPRiskSurveyFamily {
    idPatient: number;
    familyMemberCancer: boolean;
    moreThanThreeFamiliarCancer: boolean;
    familiarWithCancerColorectal: boolean;
    wichFamiliarWithCancerColorectal: string;
}

export interface CBPRiskSurveyFamilyCancer {
    idRiskSurveyFamilyCancer: number;
    idPatient: number;
    familyMember: string;
    age: number;
    cancer: string;
}
