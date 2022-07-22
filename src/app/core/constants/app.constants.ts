import { LocaleInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';

export class AppConstants {

    //Data table constants
    public static pageSizeOptions: number[] = [5, 10, 20];
    public static allowSort: boolean = true;

    //pattern constants
    public static DATE_FORMAT: string = "yyyy-MM-dd'T'HH:mm";
    public static DATE_PARSE: string = "yyyy-M-dd'T'HH:mm:ss.SSSX";
    public static DATE_ONLY: string = "dd-MM-yyyy";
    public static phoneNumberPattern: RegExp = new RegExp(/^([2-9])(\d{4})(\d{4})$/)
    public static emailPattern: RegExp = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);

    //auth constants
    public static authEndpoint: string = "login";

    //scheduler
    public static schedulerDays: number[] = [1, 2, 3, 4, 5, 6];
    public static schedulerFirstDay: number = 1;
    public static schedulerHiddenDays: number[] = [0];
    public static schedulerAllDay: boolean = false;
    public static allowScheduleInteractions: boolean = true;
    public static CONFIRM_EVENT_CHANGES: boolean = true;
    public static schedulerStart: string = "08:00:00";
    public static schedulerEnd: string = "20:00:01";
    public static schedulerLocales: LocaleInput[] = [esLocale];
    public static schedulerLocale: string = 'es';
    public static schedulerInitialView = "timeGridWeek";
    public static DEFAULT_LOAD: string = "month";
    public static LOAD_LIMIT: number = 10;

    //administrative
    public static getRegionsEndpoint: string = "getRegion";
    public static getCommuneByRegion: string = "getCommuneByRegion";
    public static getCCREnrollmentSurvey: string = "GetSurveyCCR";
    public static getCBPEnrollmentSurvey: string = "GetSurveyCBP";

    // API's
    public static CBP_PATIENT_API: string = "https://precosbackend.herokuapp.com/cbpAPI/";
    public static CBP_SCHEDULING_API: string = "https://precosbackend.herokuapp.com/cbpSchedulingAPI/";
    public static CCR_PATIENT_API: string = "https://precosbackend.herokuapp.com/ccrAPI/";
    public static CCR_SCHEDULING_API: string = "https://precosbackend.herokuapp.com/ccrSchedulingAPI/";
    public static PATIENT_API: string = "https://precosbackend.herokuapp.com/patientAPI/";
    public static AUTH_API: string = "https://precosbackend.herokuapp.com/api/";
    public static ADMIN_API: string = "https://precosbackend.herokuapp.com/administrativeAPI/";
    public static USERS_API: string = "https://precosbackend.herokuapp.com/userAPI/";

    // CANCER
    public static CBP_NAME: string = "Broncopulmonar";
    public static CBP_KEY: string = "CBP";
    public static CCR_NAME: string = "Colorrectal";
    public static CCR_KEY: string = "CCR";

    // ERROR HANDLING
    public static ACCESS_DENIED: string = "Permisos insuficientes; acceso denegado.";
    public static UNKNOWN_ERROR: string = "Error desconocido;";
    public static UNKNOWN: string = "Desconocido/a";
    public static NO_DATA: string = "No Informado/a";
    public static NO_TABLE_DATA: string = "No hay datos que mostrar.";
    public static NO_TABLE_DATA_ERROR: string = "Ha ocurrido un problema, compruebe su conexión a internet.";
    public static FORM_ERROR: string = "Existen errores en el formulario. Por favor revise la información entregada.";
    public static ERROR_REQUIRED: string = "Campo requerido.";
}
