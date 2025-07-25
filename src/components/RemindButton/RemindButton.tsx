import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

import { setReminder } from "@controllers/userPreferences/userPreferences";
import { AuthForms } from "@components/AuthForms/AuthForms";
import { useAuthStore } from "@stores/authStore";

const modalId = "remind-modal";

export const RemindButton = () => {
  const { isAuthenticated } = useAuthStore();
  const [isClicked, setIsClicked] = useState(false);

  const handleRemind = () => {
    if (isAuthenticated) {
      setIsClicked(true);
      setReminder();
      setTimeout(() => { setIsClicked(false); }, 2000);
      return;
    }

    (document.getElementById(modalId) as HTMLDialogElement).showModal();

  };

  useEffect(() => {
    if (isAuthenticated) (document.getElementById(modalId) as HTMLDialogElement).close();
  }, [isAuthenticated]);

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Se te enviará un recordatorio a tu correo">
        <button onClick={handleRemind} className="btn btn-outline hover:btn-success btn-xs relative text-nowrap transition-all duration-300 ease-in-out">
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