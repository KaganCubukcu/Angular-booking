export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  token: string;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};