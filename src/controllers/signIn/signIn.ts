import { globalController } from "@controllers/globalController/globalController";
import type { User } from "@stores/authStore";

type SignInData = {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const signIn = async (data: SignInData): Promise<AuthResponse> => await globalController("/sign-in", "POST", data); 