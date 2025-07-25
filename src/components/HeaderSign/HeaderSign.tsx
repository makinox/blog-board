import { useAuthStore } from "@stores/authStore";
import type { CSSProperties } from "react";

const anchor = "--anchor-1";
const popoverId = "popover-1";

export const HeaderSign = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => logout();

  if (isAuthenticated) return (
    <>
      <button tabIndex={0} className="avatar avatar-placeholder cursor-pointer" popoverTarget={popoverId} style={{ "anchorName": anchor } as CSSProperties}>
        <div className="bg-transparent border border-stone-400 w-8 rounded-full hover:border-stone-500">
          <span className="text-base">{user?.name.charAt(0).toUpperCase()}</span>
        </div>
      </button>
      <div tabIndex={0} className="dropdown dropdown-end menu w-52 rounded-box border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 shadow-sm mt-2"
        popover="auto" id={popoverId} style={{ "positionAnchor": anchor } as CSSProperties}>
        <h3 className="text-center">Hola {user?.name}</h3>
        <div className="flex items-center">
          <button className="btn btn-error btn-outline btn-xs mx-auto mt-4 mb-2" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </>
  );

  return (
    <a href="/auth" className="btn btn-outline btn-xs hover:btn-info">
      Iniciar Sesión
    </a>
  );
};