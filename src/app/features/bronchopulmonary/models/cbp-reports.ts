import { Patient } from "../../patient/models/patient";


export interface CBPPatientReports {
    idpatient?:number;
    state?:string
    rut:string;
    name?: string;
    lastname? : string;
    lastname2?:string;
    sex?: string;
    edad:number;
    birthday?:string;
    cellphone?: number;
    ephone?: number;
    mail?:string;
    fonasa?: string;
    cesfam?: string;
    address: string;
    village: string;
    derivacion?: string;
    weight?:number;
    hegith?:number;
    imc:number;
    cabdomen?:number;
    pasystolic:number;
    padiastolic:number;
    smokes?:boolean;
    drinkalcohol:boolean;
    diabetes?:boolean;
    epilepsy?:boolean;
    gastricul:boolean;
    hypo?:boolean;
    lrads?:number;
    nodule?:string;
    size?:number;
    lastbiopsy?:Date;
    operated?:boolean;
    cancer?:boolean;
}


export interface OtherReports {
  cantpatientbio?: number;
  totalbio?: number;
  cantpatienttac?: number;
}

