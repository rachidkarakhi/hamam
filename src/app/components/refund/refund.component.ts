import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Refund } from 'src/app/models/refund';
import { AuthService } from 'src/app/services/auth.service';
import { RefundService } from 'src/app/services/refund.service';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit {
admin='';

  constructor(private  refundService:RefundService,private route: ActivatedRoute,private router: Router,private authService:AuthService) {
    if (! localStorage.getItem('currentUser')) {
      this.router.navigate(['/login']);
    }else{
      this.admin=String(localStorage.getItem('currentUsername'));

    }

   }
  refunds: Refund[]=[];
  inputshowed=0;
  users: any[]=[];
  loader=true;
  resultRefunds: Refund[]=[];
      id:any;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRefund();
    this.getUsers();
  }
  getUsers(){
    this.authService.getusers().subscribe(
      data => {
      this.users=data;
      console.log('lay user',this.users);

    },
      error => {
         console.log('oops', error);


    }

    )
  }

  setclass(id:number){
    var ret="uknown";
    const index = this.users.findIndex(x => x.id === id );
    if (index<0) {
       ret="uknown";
    }else{
       ret=this.users[index].name;
    }



    return  { state: ret }
  }
  getRefund() {
    this.refundService.findall(this.id).subscribe((refunds: Refund[]) =>{
      this.resultRefunds=this.refunds=refunds;
      this.loader=false;
      console.log('lay',refunds);
    })
  }
  deleteRfund(refundt:Refund){
    this.inputshowed=Number(refundt.id);
this.refundService.deleteRefund(this.id,refundt.id).subscribe((refund: Refund) =>{
  //console.log(refund);
  const index = this.resultRefunds.indexOf(refundt, 0);
if (index > -1) {
  this.resultRefunds.splice(index, 1);
  this.inputshowed=0;
}
})
  }
  confirmeMethod(refundt:Refund) {
    if(confirm("Étes-vous certain de vouloir supprimer cette ligne " + refundt.id)) {
      this.deleteRfund(refundt);
    }
  }

}
