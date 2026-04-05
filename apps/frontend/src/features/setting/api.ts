import { deleteRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import type {
  CreateEmailProviderInput,
  CreateSmtpInput,
  UpdateEmailProviderInput,
} from "@repo/schemas";

export const emailApi = {
  createProvider: async (data: CreateEmailProviderInput) => {
    const res = await postRequest({ path: "/email", data });
    return res;
  },
  createSMTP: async (data: CreateSmtpInput) => {
    const res = await postRequest({ path: "/email/smtp", data });
    return res;
  },
  getProviders: async () => {
    const res = await getRequestMany({ path: "/email" });
    return res;
  },
  updateCredentials: async (id: string, data: UpdateEmailProviderInput) => {
    const res = await patchRequest({ path: `/email/${id}`, data });
    return res;
  },
  deleteProvider: async (id: string) => {
    const res = await deleteRequest({ path: `/email/${id}` });
    return res;
  },
  testProvider: async () => {
    const res = await postRequest({ path: `/email/test` });
    return res;
  },
};
