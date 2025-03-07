export class User {
  user_id: number = 0; // Use number for Long, initialize with a default value
  username: string = '';
  first_name: string = '';
  last_name?: string;     // Make last_name optional using '?'
  email: string = '';
  role: string = '';
  profileImageUrl?: string; // Make profileImageUrl optional
  created_at?: string;    // Make created_at optional and use string for LocalDateTime


constructor(
  user_id?: number, // Make constructor parameters optional
  username?: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  role?: string,
  profileImageUrl?: string,
  created_at?: string
) {
  if (user_id !== undefined) this.user_id = user_id;
  if (username !== undefined) this.username = username;
  if (first_name !== undefined) this.first_name = first_name;
  if (last_name !== undefined) this.last_name = last_name;
  if (email !== undefined) this.email = email;
  if (role !== undefined) this.role = role;
  if (profileImageUrl !== undefined) this.profileImageUrl = profileImageUrl;
  if (created_at !== undefined) this.created_at = created_at;
}
}