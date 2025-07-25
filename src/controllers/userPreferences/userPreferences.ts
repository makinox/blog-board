import { globalController } from "@controllers/globalController/globalController";

interface UserPreferencesResponse {
  success: boolean;
  message: string;
  preferences: {
    id: number;
    userId: number;
    notifyNewBlogs: boolean;
    createdAt: string;
    updatedAt: string;
  }
}

export const setReminder = async (): Promise<UserPreferencesResponse> => {
  return await globalController("/user-preferences", "PUT", {
    notifyNewBlogs: true
  });
};