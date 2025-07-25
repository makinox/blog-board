import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

import { setReminder } from "@controllers/userPreferences/userPreferences";
import { AuthForms } from "@components/AuthForms/AuthForms";
import { useAuthStore } from "@stores/authStore";
import { cn } from "@lib/utils";

const modalId = "like-modal";

export const LikeButton = () => {
  const { isAuthenticated } = useAuthStore();
  const [isClicked, setIsClicked] = useState(false);

  const classes = {
    button: cn("btn btn-outline hover:btn-error btn-xs relative text-nowrap transition-all duration-300 ease-in-out", {
      "btn-error": isClicked,
    })
  };

  const handleLike = () => {
    if (isAuthenticated) {
      setIsClicked(true);
      setReminder();
      setTimeout(() => { setIsClicked(false); }, 2000);
      return;
    }

    (document.getElementById(modalId) as HTMLDialogElement).showModal();

  };

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