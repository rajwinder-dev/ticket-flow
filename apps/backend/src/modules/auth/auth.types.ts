export interface LoginService {
  email: string;
  password: string;
}
export interface SignupService extends LoginService {
  email: string;
     name: string
}
export interface ChangePasswordService {
  currentPassword: string;
  password: string;
  confirmPassword: string;
  userId: string;

}
