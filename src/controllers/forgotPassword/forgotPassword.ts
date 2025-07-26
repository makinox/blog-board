import { globalController } from "@controllers/globalController/globalController";

type ForgotPasswordData = {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => 
  await globalController("/request-password-reset", "POST", data); 