import { Schedule } from "../../scheduling/models/schedule";
import { CBPPatientEnrollmentSchedule } from "./cbp-patient";

export interface TACTrackingPatient {
    contact: boolean;
    ldctDate: Date;
    nextDate: Date;
    name: string;
    mail: string;
    cellphone: number;
    lastName: string;
    lastName2: string;
    idPatient: number;
    emergencyPhone: number;
}

export interface CBPEnrollmentSchedule extends Schedule {
    patients: CBPPatientEnrollmentSchedule[];
}