export class CustomHttpResponse<T>{
    data:T;
    msg?:string;
    constructor(data:any){
        this.data = data
    }
}
