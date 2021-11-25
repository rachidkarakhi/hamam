export class Item {

    id?:number;
    name:string;
    product_id:number;
    quantity:number;
    static variation_id:number=0;
    price:number;

    total:string;
    variation_id:number;
    constructor(){

        this.product_id = 0;

        this.price = 0;
        this.name = "";
        this.quantity = 0;

        this.total = "";
        this.variation_id=0;
    }

}
