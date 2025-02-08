export class UserResponse {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;

    constructor(
        username: string,
        first_name: string,
        last_name: string,
        email: string,
        role: string,
        created_at: string
    ) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.role = role;
        this.created_at = created_at;
    }
}
