import { globalController } from "@controllers/globalController/globalController";

type VerifyEmailData = {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
  const query = `/verify-email?token=${data.token}`;
  const response = await globalController(query, "GET");

  return response;
};