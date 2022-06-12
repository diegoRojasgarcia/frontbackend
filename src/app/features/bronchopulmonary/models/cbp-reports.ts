import { Patient } from "../../patient/models/patient";

export interface CBPPatientReports extends Patient {
    idpatient?:number;
    name?: string;
    lastname : string;
    lastname2?:string;
    edad?:number;
    rut:string;
    birthday?:string;
    sex?: string;
    cesfam?: string;
    address?: string;
    cellphone?: number;
    ecellphone?: number;
    fonasa?: string;
    derivationstatenfm?: string;
    cancerdetectiondate?: Date;
    type?: string;
    biopsydate?: Date;
}
