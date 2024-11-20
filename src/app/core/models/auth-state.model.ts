import { UserModel } from '../../features/auth/store/auth.model';

export interface AuthStateInterface {
  currentUser: UserModel | null;
  loading: boolean;
  error: string | null;
}
