import { globalController } from "@controllers/globalController/globalController";

type ResetPasswordData = {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => 
  await globalController("/reset-password", "POST", data); 