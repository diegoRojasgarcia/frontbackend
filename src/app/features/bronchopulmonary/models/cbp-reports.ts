import { Patient } from "../../patient/models/patient";


export interface CBPPatientReports {
    idpatientcbp?:number;
    estadocbp?:string
    rut:string;
    name?: string;
    lastname? : string;
    lastname2?:string;
    mail?:string;
    sex?: string;
    edad:number;
    birthday?:string;
    cellphone?: number;
    emergencycellphone?: number;
    fonasa?: string;
    cesfam?: string;
    derivacion?: string;
    weight?:number;
    hegith?:number;
    imc:number;
    cabdominal?:number;
    padiastolic:number;
    pasystolic:number;
    smokes?:boolean;
    numbercigarettes?:number;
    ysmoking:number;
}


export interface OtherReports {
  cantpatientbio?: number;
  totalbio?: number;
  cantpatienttac?: number;
}

