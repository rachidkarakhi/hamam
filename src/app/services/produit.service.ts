import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from '../models/produit';
import { Categorie } from '../models/categorie';
import { Order } from '../models/order';



@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'})
  // };

   optionRequete = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',

    })
  };



  params = new HttpParams().set("consumer_key","ck_859fe97955b32a8d5ec0694d78d8996d40ea3181").set("consumer_secret", "cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43");

  constructor(private https:HttpClient) { }
  findall(page:number){


    return this.https.get("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products?per_page=100&page="+page,{params: this.params,observe: 'response'})



  }

  findbycat(cat:any,page:number){
    return this.https.get("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products?per_page=100&page="+page+"&category="+cat,{params: this.params,observe: 'response'});
  }
  search(search:any){
    return this.https.get("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products?per_page=100&sku="+search,{params: this.params,observe: 'response'});
  }
  findallCat(){

    return this.https.get<Categorie[]>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products/categories?per_page=100",{params: this.params});
  }
  persist(order:Order){
    return this.https.post<Order[]>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders?consumer_key=ck_859fe97955b32a8d5ec0694d78d8996d40ea3181&consumer_secret=cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43",order);
  }
}
