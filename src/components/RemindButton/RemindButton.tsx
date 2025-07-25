import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

import { setReminder } from "@controllers/userPreferences/userPreferences";
import { AuthForms } from "@components/AuthForms/AuthForms";
import { useAuthStore } from "@stores/authStore";
import { cn } from "@lib/utils";

const modalId = "remind-modal";

export const RemindButton = () => {
  const { isAuthenticated } = useAuthStore();
  const [isClicked, setIsClicked] = useState(false);

  const classes = {
    button: cn("btn btn-outline hover:btn-success btn-xs relative text-nowrap transition-all duration-300 ease-in-out", {
      "btn-success animate-pulse cursor-not-allowed": isClicked,
    })
  };

  const handleRemind = () => {
    if (isAuthenticated) {
      setIsClicked(true);
      setReminder();
      setTimeout(() => { setIsClicked(false); }, 500);
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