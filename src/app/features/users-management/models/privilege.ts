export interface Privilege {
    idPrivilege?: number,
    name: string,
}
export interface PRIVILEGE {
    ID: number;
    NAME: string;
    FEATURE_PERMISSION: FeaturePermission[];
}



export enum Features {
    USER_MANAGEMENT = "USER_MANAGEMENT",
    SCHEDULING = "SCHEDULING",
    ENROLLMENT = "ENROLLMENT",
    PATIENT_FILES = "PATIENT_FILES",
    EXAMS = "EXAMS"
}

export enum Permission {
    NONE = "NONE",
    VIEW = "VIEW",
    ADMIN = "ADMIN"
}

export enum Speciality {
    CCR = "CCR",
    CBP = "CBP",
    ALL = "ALL"
}

export interface FeaturePermission {
    FEATURE: Features,
    PERMISSION: Permission
}
