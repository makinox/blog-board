import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

import { likeBlog, unlikeBlog, getBlogLikes } from "@controllers/blogLikes/blogLikes";
import { AuthForms } from "@components/AuthForms/AuthForms";
import { useAuthStore } from "@stores/authStore";
import { useBlogStore, type Blog } from "@stores/blogStore";
import { cn, getCurrentBlogUrl } from "@lib/utils";

const modalId = "like-modal";

const updateBlogLikesFromStore = (blogs: Blog[]) => {
  const blog = blogs.find((blog) => blog.page_url === getCurrentBlogUrl());
  return blog?.isLiked || false;
};

export const LikeButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { blogs, addBlog, setNotifyNewBlogs } = useBlogStore();
  const [isLiked, setIsLiked] = useState(updateBlogLikesFromStore(blogs));

  const classes = {
    button: cn("btn hover:btn-error btn-xs relative text-nowrap transition-all duration-300 ease-in-out", {
      "btn-error btn-outline animate-pulse cursor-not-allowed": isClicked,
      "btn-outline": !isLiked,
      "btn-error": isLiked,
    })
  };

  const handleLike = async () => {
    if (!isAuthenticated) return (document.getElementById(modalId) as HTMLDialogElement).showModal();
    setIsClicked(true);

    if (isLiked) {
      const response = await unlikeBlog();
      if (!response.success) return;

      addBlog({
        page_url: getCurrentBlogUrl(),
        isLiked: false,
      });
      setIsLiked(false);
    } else {
      const response = await likeBlog();
      if (!response.success) return;

      addBlog({
        page_url: response.data.page_url,
        isLiked: true,
      });
      setIsLiked(true);
    }

    setTimeout(() => { setIsClicked(false); }, 500);
    return;
  };

  const getLikes = async () => {
    const response = await getBlogLikes();
    if (!response.success) return;

    addBlog({
      page_url: response.data.page_url,
      likes: response.data.total_likes,
      isLiked: response.data.user_liked,
    });
    setNotifyNewBlogs(response.data.user_notify_new_blogs);
    setIsLiked(response.data.user_liked);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    getLikes();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (!modal.open) return;

    modal.close();
    handleLike();

  }, [isAuthenticated]);

  return (
    <>
      <button onClick={handleLike} className={classes.button}>
        <span>{isClicked ? "Me gusta..." : "Me gusta"}</span>
        <FaHeart />
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-10">Para poder marcar como favorito debes iniciar sesión</h3>
          <AuthForms />

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};