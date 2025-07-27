import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

import { setReminder } from "@controllers/userPreferences/userPreferences";
import { AuthForms } from "@components/AuthForms/AuthForms";
import { useAuthStore } from "@stores/authStore";
import { cn } from "@lib/utils";
import { useBlogStore } from "@stores/blogStore";

const modalId = "remind-modal";

export const RemindButton = () => {
  const { isAuthenticated } = useAuthStore();
  const [isClicked, setIsClicked] = useState(false);
  const { notifyNewBlogs, setNotifyNewBlogs } = useBlogStore();

  const classes = {
    button: cn("btn hover:btn-success btn-xs relative text-nowrap transition-all duration-300 ease-in-out", {
      "btn-success btn-outline animate-pulse cursor-not-allowed": isClicked,
      "btn-success": notifyNewBlogs,
      "btn-outline": !notifyNewBlogs
    })
  };

  const handleRemind = () => {
    if (notifyNewBlogs) return;
    if (isAuthenticated) {
      setIsClicked(true);
      setReminder();
      setTimeout(() => { setIsClicked(false); setNotifyNewBlogs(true); }, 500);
      return;
    }

    (document.getElementById(modalId) as HTMLDialogElement).showModal();

  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (!modal.open) return;

    modal.close();
    handleRemind();

  }, [isAuthenticated]);

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Se te enviará un recordatorio a tu correo">
        <button onClick={handleRemind} className={classes.button}>
          <span>{isClicked ? "Recordando..." : "Recordar"}</span>
          <FaBell />
        </button>
      </div>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-10">Para poder recordarte debes iniciar sesión</h3>
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