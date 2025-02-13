export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface CreateUsertDTO extends Omit<User, 'id'>{}
