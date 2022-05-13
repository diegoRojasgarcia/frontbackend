export class AppError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = AppError.name;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}