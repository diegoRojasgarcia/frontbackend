export interface TAC{
    size:number;
    nodule:string;
    contact:boolean;
    biopsy:boolean;
    idLdct:number;
    idPatient:number;
    lungRads:number;
    ldctDate:Date;
    nextDate:Date;
    petTc:boolean;
}

export interface CBPBiopsy{
    type:string;
    idBiopsy:number;
    idPatient:number;
    biopsyDate:Date;
}

export interface CBPBiopsyType{
    type:string;
}
export enum RADS{
    TAC0,
    TAC1,
    TAC2,
    TAC3,
    TAC4A="4A",
    TAC4B="4B",
    TAC4C="4C",
}