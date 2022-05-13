import { Patient } from "../../patient/models/patient";

export interface CCRPatient extends Patient {
    idCcr:number;
    coloncheckResult:boolean;
    colonoscopyResult:boolean;
    neoplasticLesion:boolean;
    polyps:boolean;
}
