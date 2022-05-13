export interface CCREnrollmentPatientSchedule {
    id_schedule_patient?: number;
    name: string;
    age: number;
    rut:string;
}

export interface CCRPatientSchedule {
    idPatient: number;
    contact: boolean|null;
    name: string;
}


