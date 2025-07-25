import { globalController } from "@controllers/globalController/globalController";
import { getCurrentBlogUrl } from "@lib/utils";

const path = "/blog-likes";

interface BlogLikesResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    page_url: string;
    created_at: string;
  }
}

export const likeBlog = async (): Promise<BlogLikesResponse> => {
  const page_url = getCurrentBlogUrl();
  return await globalController(path, "POST", {
    page_url,
  });
};

interface BlogUnlikesResponse {
  success: boolean;
  message: string;
}

export const unlikeBlog = async (): Promise<BlogUnlikesResponse> => {
  const page_url = getCurrentBlogUrl();
  return await globalController(path, "DELETE", {
    page_url,
  });
};

interface BlogLikesCountResponse {
  success: boolean;
  message: string;
  data: {
    page_url: string;
    total_likes: number;
    user_liked: boolean;
  }
}

export const getBlogLikes = async (): Promise<BlogLikesCountResponse> => {
  const page_url = getCurrentBlogUrl();
  const query = `/count?page_url=${page_url}`;
  return await globalController(path + query, "GET");
};