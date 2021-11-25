export interface Produit {
    id:number;
    type:string;
    price:number;
    name:string;
    qtt:number;
    stock_quantity: number;
    stock_status: string;
    sku: string;
    images:[
        {
            src:string
        }

    ];
    variations: number[];
    attributes:[
      {
        name :string,
        variations: string[];
      }
    ];

}
