import type {
  CreateEmailProviderInput,
  CreateSmtpInput,
  EmailProviderSchema,
  UpdateEmailProviderInput,
} from "@org/zod";
import { api } from "../../api.js";

export const emailApi = {
  createProvider: async (data: CreateEmailProviderInput) => {
    const res = await api.post({ path: "/email", data });
    return res;
  },
  createSMTP: async (data: CreateSmtpInput) => {
    const res = await api.post({ path: "/email/smtp", data });
    return res;
  },
  getProviders: async () => {
    const res = await api.getMany<EmailProviderSchema>({ path: "/email" });
    return res;
  },
  updateCredentials: async (id: string, data: UpdateEmailProviderInput) => {
    const res = await api.patch({ path: `/email/${id}`, data });
    return res;
  },
  deleteProvider: async (id: string) => {
    const res = await api.delete({ path: `/email/${id}` });
    return res;
  },
  testProvider: async () => {
    const res = await api.post({ path: `/email/test` });
    return res;
  },
};
