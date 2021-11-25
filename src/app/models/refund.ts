import { Item } from "./item";

export class Refund {
    id?:number;
    amount:string;
    reason:string;
    api_refund:boolean;
    date_created:string;
    line_items:{};
    total:number;
    refunded_by
    constructor(){
        this.id = 0;
        this.refunded_by= 0;
        this.amount = "0";
        this.date_created = "0";
        this.reason = "";
        this.total = 0;

        this.api_refund=false;
        this.line_items={};


    }
}
