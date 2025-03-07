// user-response.model.ts (or similar)
export class UserResponse {
    username?: string; // Make username optional
    first_name?: string; // Make first_name optional
    last_name?: string; // Make last_name optional - THIS IS THE KEY CHANGE
    email?: string; // Make email optional
    role?: string; // Make role optional
    created_at?: string; // Make created_at optional
    profileImageUrl?: string; // profileImageUrl is already optional

    constructor(
        username?: string, // Make constructor parameters optional
        first_name?: string,
        last_name?: string,
        email?: string,
        role?: string,
        created_at?: string,
        profileImageUrl?: string
    ) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.role = role;
        this.created_at = created_at;
        this.profileImageUrl = profileImageUrl;
    }
}