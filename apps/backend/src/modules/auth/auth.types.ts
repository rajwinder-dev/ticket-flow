export interface LoginService {
  username: string;
  password: string;
}
export interface SignupService extends LoginService {
  email: string;
  confirmPassword: string;
}
export interface ChangePasswordService {
  currentPassword: string;
  password: string;
  confirmPassword: string;
  userId: string;
}
