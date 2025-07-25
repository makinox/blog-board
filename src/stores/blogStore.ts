import { create } from "zustand";

export interface Blog {
  page_url: string;
  likes: number;
  isLiked: boolean;
}

export interface BlogStore {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Partial<Blog>) => void;
  getBlog: (page_url: string) => Blog | undefined;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  setBlogs: (blogs: Blog[]) => set({ blogs }),
  addBlog: (blog: Partial<Blog>) => set((state) => {
    const currentBlogs = state.blogs;
    const blogExists = currentBlogs.find((b) => b.page_url === blog.page_url);
    if (blogExists) {
      blogExists.isLiked = blog.isLiked || blogExists.isLiked;
      blogExists.likes = blog.likes || blogExists.likes;
    } else {
      if (!blog.page_url) return { blogs: currentBlogs };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentBlogs.push(blog as any);
    }
    return { blogs: currentBlogs };
  }),
  getBlog: (page_url: string) => get().blogs.find((b) => b.page_url === page_url),
}));