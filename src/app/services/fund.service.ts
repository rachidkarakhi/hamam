import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fund } from '../models/fund';

@Injectable({
  providedIn: 'root'
})
export class FundService {

  constructor(private http:HttpClient) { }
  persist(fund:Fund){

    // la creation
    return this.http.post<Fund>("http://localhost:5000/funds/", fund);
  }
  updatedate(id:number,dateFermetur:string){
    return this.http.patch("http://localhost:5000/funds/"+id, {dateFermetur: dateFermetur});
  }
  getfund(id:number){
    return this.http.get<Fund>("http://localhost:5000/funds/"+id);
  }
  updateTurnover(id:number,total:number){

   return this.http.patch("http://localhost:5000/funds/"+id, {turnover: total});

  }
  updateTurnoverM(id:number,total:number){

   return this.http.patch("http://localhost:5000/funds/"+id, {turnover: total});

  }
  getall(user_id:number){
    return this.http.get<Fund[]>("http://localhost:5000/funds/?dateFermetur=n&user_id="+user_id);
  }
}
