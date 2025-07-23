import { sharedClasses } from "@styles/sharedClasses";
import { AuthTabs } from "../AuthForms/AuthFormTabs";

export const SignUpForm = () => {
  return <div id={AuthTabs.SignUp} className="space-y-4">
    <div className="form-control">
      <label className="label">
        <span className={sharedClasses.inputLabel}>Nombre completo</span>
      </label>
      <input
        type="text"
        placeholder="Tu nombre completo"
        className={sharedClasses.input}
      />
    </div>

    <div className="form-control">
      <label className="label">
        <span className={sharedClasses.inputLabel}>Email</span>
      </label>
      <input
        type="text"
        placeholder="Tu nombre completo"
        className={sharedClasses.input}
      />
    </div>

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
    </div>

    <div className="form-control">
      <label className="label">
        <span className={sharedClasses.inputLabel}>Confirmar contraseña</span>
      </label>
      <input
        type="password"
        placeholder="••••••••"
        className={sharedClasses.input}
      />
    </div>

    <div className="form-control">
      <label className="label cursor-pointer">
        <span className={sharedClasses.inputLabel}>
          Acepto los <a href="#" className="link link-hover text-stone-500 dark:text-stone-400">términos y condiciones</a>
        </span>
        <input type="checkbox" className="checkbox checkbox-sm" />
      </label>
    </div>

    <button className="btn btn-primary w-full bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 dark:text-black text-white border-0">
      Crear cuenta
    </button>
  </div>;
};