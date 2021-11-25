import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Refund } from '../models/refund';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  params = new HttpParams().set("consumer_key","ck_859fe97955b32a8d5ec0694d78d8996d40ea3181").set("consumer_secret", "cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43").set("filter[limit]" ,"-1");

  constructor(private http:HttpClient) { }
  findall(page:number){
    return this.http.get<Order[]>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders?per_page=100&page="+page,{params: this.params,observe: 'response'});
  }
  updateqty(id:any,status:string){
    return this.http.put("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders/"+id+"?consumer_key=ck_859fe97955b32a8d5ec0694d78d8996d40ea3181&consumer_secret=cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43",{"status": status} );
  }
  insertrefund(refund:any,id:any){
    return this.http.post<Refund>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders/"+id+"/refunds?consumer_key=ck_859fe97955b32a8d5ec0694d78d8996d40ea3181&consumer_secret=cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43",refund );
  }
  deleteRefund(idO:any,id:any){
    return this.http.delete<Refund>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders/"+idO+"/refunds/"+id+"?force=true",{params: this.params});
  }
  getOrder(id:any){
    return this.http.get<Order>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders/"+id,{params: this.params});
  }


}
