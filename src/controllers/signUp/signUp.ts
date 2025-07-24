import { globalController } from "@controllers/globalController/globalController";

type SignUpData = {
  name: string;
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => await globalController("/sign-up", "POST", data);