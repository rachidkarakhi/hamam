import { Item } from "./item";
import { Refund } from "./refund";

export class Order {
    id:string;
    total:number;
    payment_method:string;
    set_paid: boolean;
    line_items:[Item];
    refunds:[Refund];
    status: string;
    customer_id:number;
    transaction_id: string;
    constructor(){
      this.customer_id=0;
      this.id = "0";
      this.total = 0;
      this.payment_method = "";
      this.set_paid=false;
      this.line_items=[new Item];
      this.refunds=[new Refund];
      this.status="completed";
      this.transaction_id="";
  }
}
