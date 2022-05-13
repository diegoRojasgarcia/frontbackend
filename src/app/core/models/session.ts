import { Speciality } from "../../features/users-management/models/privilege";

export interface Session {
    idUser:number,
    token:string,
    privilege:number,
    name:string,
    msg:string,
    idSpeciality?:Speciality
}
