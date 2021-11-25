export class Fund {
  id?:number;
  user_id:number;
  name:string;
  dateOvertur:string;
  dateFermetur:string;
  fund:number;
  turnover:number;



  constructor(){

      this.id = 0;
      this.user_id= 0;
      this.name = "";
      this.dateOvertur = "";
      this.dateFermetur = "n";
      this.fund=0;
      this.turnover=0;



  }
}
