import { Patient } from "../../patient/models/patient";

export interface CBPPatient extends Patient {
    idCbp?:number;
    state?: string;
    derivationStateNfm : string;
    lungRads?:string;
    riskProfession?:boolean;
    tacCounter?:number;
    motivorechazo:string;
}

export interface CBPPatientEnrollmentSchedule{
    id_schedule_patient?:number;
    name:string;
    age:number;
    rut:string;
    contact?:boolean;
}