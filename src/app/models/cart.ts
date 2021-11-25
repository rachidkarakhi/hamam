export class Cart {
    qtt:number;
    product_id:number;
    price:number;
    sub:number;
    name:string;
    image:string;
    variation_id:number;

    constructor(qtt: number,product_id: number,price:number,name:string,image:string,sub:number,variation_id:number) {
        this.qtt = qtt;
        this.product_id = product_id;
        this.price = price;
        this.sub = sub;
        this.name = name;
        this.image = image;
        this.variation_id=variation_id;
      }
}
