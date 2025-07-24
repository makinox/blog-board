import { useAuthStore } from "@stores/authStore";

export const HeaderSign = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) return (
    <div className="avatar avatar-placeholder cursor-pointer">
      <div className="bg-transparent border border-stone-300 w-8 rounded-full">
        <span className="text-base">{user?.name.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  );

  return (
    <a href="/auth" className="btn btn-outline btn-xs hover:btn-info">
      Iniciar Sesión
    </a>
  );
};