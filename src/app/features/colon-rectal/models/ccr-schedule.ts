import { Schedule } from "../../scheduling/models/schedule";
import { CCREnrollmentPatientSchedule } from "./patient-schedule";


export interface CCREnrollmentSchedule extends Schedule {
    idSchedule:number;
    patients: CCREnrollmentPatientSchedule[]
}

