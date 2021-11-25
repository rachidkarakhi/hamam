import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FundService } from 'src/app/services/fund.service';
import { Fund } from 'src/app/models/fund';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private  fundService:FundService,private authService:AuthService,private router: Router) {
    if ( localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
  }
  auth:any = {
    username:'',
    password:'',
  };
  showloader=false;


  data: SafeHtml | undefined;

  ngOnInit(): void {


  }
verify(){
  this.showloader=true;

  if (this.auth.password=='' || this.auth.username=='') {

    this.data="حقل اسم المستخدم أو حقل كلمة المرور فارغ";
    this.showloader=false;

  }else{
    this.connect();
  }
}
connect(){
  // console.log('riight');
  this.authService.connect(this.auth).subscribe(
    data => {
      // console.log('success', data);
this.authService.getuser(data.user_email).subscribe(
  data2 => {
    // ila makhedematch katmchi l '/www/wp-includes/rest-api/endpoints/class-wp-users-controller commenti line
    // 301 // $prepared_args['has_published_posts'] = get_post_types( array( 'show_in_rest' => true ), 'names' );
    // console.log('success', data2);
     localStorage.setItem('currentUser', data2[0].id);
     localStorage.setItem('currentUsername', data2[0].name);


     const user = localStorage.getItem('currentUser');


     let fundsArray = JSON.parse(String(localStorage.getItem('fundsArray')));

    if(fundsArray == null){
      fundsArray = [];
    }

 for (let index = 0; index < fundsArray.length; index++) {
   if (JSON.parse(fundsArray[index]).user_id == Number(user)) {

    localStorage.setItem('fund',JSON.parse(fundsArray[index]).name);
    console.log(JSON.parse(fundsArray[index]).name);
   }

 }
      this.router.navigate(['/']);
},
  error => {
     console.log('oops', error);


}

)


    this.showloader=false;
  },
    error => {
      // console.log('oops', error);
    this.data=error.error.message;
    this.showloader=false;
  }

  );

}
}
