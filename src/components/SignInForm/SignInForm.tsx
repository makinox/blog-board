import { sharedClasses } from "@styles/sharedClasses";
import { AuthTabs } from "../AuthForms/AuthFormTabs";

export const SignInForm = () => {
  return <div id={AuthTabs.SignIn} className="space-y-4">
    <div className="form-control">
      <label className="label">
        <span className={sharedClasses.inputLabel}>Email</span>
      </label>
      <input
        type="email"
        placeholder="tu@email.com"
        className={sharedClasses.input}
      />
    </div>

    <div className="form-control">
      <label className="label">
        <span className={sharedClasses.inputLabel}>Contraseña</span>
      </label>
      <input
        type="password"
        placeholder="••••••••"
        className={sharedClasses.input}
      />
      <label className="label">
        <a href="#" className="label-text-alt link link-hover text-stone-500 dark:text-stone-400 mt-1">¿Olvidaste tu contraseña?</a>
      </label>
    </div>

    <button className="btn btn-primary w-full bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 dark:text-black text-white border-0">
      Iniciar Sesión
    </button>
  </div>;

};