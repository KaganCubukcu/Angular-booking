export interface AuthLoginModel {
  email: string;
  password: string;
  user?: UserModel;
}

export interface AuthSignupModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface UserModel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}
