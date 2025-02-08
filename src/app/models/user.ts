export class User {
    username: string = '';
    first_name: string = '';
    last_name?: string;
    email: string = '';
    password: string = '';
    role: string = '';
  
    constructor(username?: string, first_name?: string, last_name?: string, email?: string, password?: string, role?: string) {
      if (username) this.username = username;
      if (first_name) this.first_name = first_name;
      if (last_name) this.last_name = last_name;
      if (email) this.email = email;
      if (password) this.password = password;
      if (role) this.role = role;
    }
  }
  