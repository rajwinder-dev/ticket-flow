import type { ApiMessage } from "@/types/genetic";
import type { AuthDetails, AuthToken, ChangePasswordInput, LoginInput, ResetPasswordInput, SignupInput } from "@repo/schemas";
import { getRequest, patchRequest, postRequest } from "../../utils/axis";

export async function signUp(input: SignupInput) {
  const data = await postRequest<AuthToken>({
    path: "/auth/signup",
    data: input,
  });
  return data;
}
export async function login(input: LoginInput) {
  const data = await postRequest<AuthToken>({
    path: "/auth/login",
    data: input,
  });
  return data;
}
export async function refreshToken() {
  const res = await getRequest<AuthToken>({ path: "/auth/refresh-token" });
  return res;
}
export async function forgetPassword(email: string) {
  const res = await getRequest({ path: `/auth/forget-password/${email}` });

  return res;
}
export async function resetPassword({token, input}:{token: string , input: ResetPasswordInput}) {
  const res = await patchRequest<ApiMessage>({ path: `/auth/reset-password/${token}`, data: input });
  return res;
}
export async function changePassword(input: ChangePasswordInput) {
  const data = await postRequest<ApiMessage>({
    path: "/auth/change-password",
    data: input,
  });
  return data;
}
export async function logOut() {
  const data = await postRequest({
    path: "/auth/logout",
  });
  return data;
}
export async function gatAuthDetails() {
  const data = await getRequest<AuthDetails>({
    path: "/auth/details",
  });
  return data;
}
// handle refresh token
