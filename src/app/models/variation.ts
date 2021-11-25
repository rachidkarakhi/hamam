import { Attribute } from "@angular/core";

export class Variation {
  id:number;
  sku:string
  price:string;
  stock_status:string;
  image:{src:string};
  stock_quantity:number;
  attributes:any[];
  name:string;
  parent_id:number;
  constructor() {
    this.id = 0;
    this.price = "0";
    this.attributes = [];
    this.image = {src:""};
    this.stock_quantity=0;
    this.stock_status="";
    this.sku="";
    this.name="";
    this.parent_id=0;
  }
}
