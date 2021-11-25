export class User {
  token:string;
  user_display_name:string;
  user_nicename:string;
  user_email:string;
  constructor(token: string,user_display_name: string,user_nicename:string,user_email:string) {
    this.token = token;
    this.user_display_name = user_display_name;
    this.user_nicename = user_nicename;
    this.user_email = user_email;
  }

}
