import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Refund } from '../models/refund';

@Injectable({
  providedIn: 'root'
})
export class RefundService {
  params = new HttpParams().set("consumer_key","ck_859fe97955b32a8d5ec0694d78d8996d40ea3181").set("consumer_secret", "cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43");

  constructor(private http:HttpClient) { }
  findall(id:any){
    return this.http.get<Refund[]>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders/"+id+"/refunds",{params: this.params});
  }
  deleteRefund(idO:any,id:any){
    return this.http.delete<Refund>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/orders/"+idO+"/refunds/"+id+"?force=true",{params: this.params});
  }
}
