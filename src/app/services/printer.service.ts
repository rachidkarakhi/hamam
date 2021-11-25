import { Injectable } from '@angular/core';
import { Order } from 'src/app/models/order';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';

// import * as path from "path";

@Injectable({
  providedIn: 'root'
})

export class PrinterService {
  constructor(private http:HttpClient) {

   }
   print(order:any,montantclient:number){
    let URL = "http://localhost/pos-printer/index.php";
     const headers = new HttpHeaders();
     headers.append('Content-Type', 'application/json');
     order.montantclient=montantclient;
     let data = order;

     return this.http
     .post(URL,JSON.stringify(data),{
         headers: headers
     }).subscribe(Response => console.log(Response))

   }
   printFinal(productsO:any,fundd:any){
    let URL = "http://localhost/pos-printer/printFinal.php";
     const headers = new HttpHeaders();
     headers.append('Content-Type', 'application/json');
     ;
     let data = {productsO,fundd};

     return this.http
     .post(URL,JSON.stringify(data),{
         headers: headers
     }).subscribe(Response => console.log(Response))

   }
}
