import { globalController } from "@controllers/globalController/globalController";
import type { User } from "@stores/authStore";

type SignUpData = {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  visitor_id: number | null;
}

export const signUp = async (data: SignUpData): Promise<SignUpResponse> => await globalController("/sign-up", "POST", data);