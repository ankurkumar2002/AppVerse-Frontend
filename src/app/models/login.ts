export class Login {
    username: string;
    password: string;
    rememberMe: boolean;
  
    constructor(username: string, password: string, rememberMe: boolean) {
      this.username = username;
      this.password = password;
      this.rememberMe = rememberMe;
    }
  
    static createEmpty(): Login {
      return new Login('', '', false);
    }
  }
  