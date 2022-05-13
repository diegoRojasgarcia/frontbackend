export interface UserModel {
    rut:string;
    name:string;
    profession:string;
    privilege:number;
    foundation:boolean;
    idUser: number;
    idSpeciality:string;
    access?:boolean;
    password?:string;
}
