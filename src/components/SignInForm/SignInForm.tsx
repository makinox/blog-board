import { useState } from "react";

import { sharedClasses } from "@styles/sharedClasses";
import { signIn } from "@controllers/signIn/signIn";
import { useAuthStore } from "@stores/authStore";
import { cn, safeWindow } from "@lib/utils";

import { AuthTabs } from "../AuthForms/AuthFormTabs";

export const SignInForm = () => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    button: ""
  });

  const classes = (hasError?: boolean) => ({
    input: cn(sharedClasses.input, {
      "border-red-500": hasError,
    }),
    errorText: cn("h-4 mt-1 block", {
      "text-red-500 text-sm": hasError,
      "invisible": !hasError,
    }),
    section: cn("mb-2"),
    button: cn("btn btn-primary w-full mb-1 bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 dark:text-black text-white border-0", {
      "opacity-50 cursor-not-allowed": isLoading
    })
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      button: ""
    };

    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El email no es válido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) return;

      const response = await signIn(formData);
      login(response.user, response.token);
      setIsLoading(false);

      const win = safeWindow();
      const isAuthPage = win?.location.pathname === "/auth";
      if (isAuthPage) win.location.href = "/";
      else win?.location.reload();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrors({
        ...errors,
        button: "Error al iniciar sesión"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <form id={AuthTabs.SignIn} data-testid="signin-form" className="space-y-4" onSubmit={handleSubmit}>
    <div className={classes().section}>
      <label className="label" htmlFor="email">
        <span className={sharedClasses.inputLabel}>Email</span>
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="tu@email.com"
        className={classes(!!errors.email).input}
      />
      <span className={classes(!!errors.email).errorText}>{errors.email}</span>
    </div>

    <div className="mb-4">
      <label className="label" htmlFor="password">
        <span className={sharedClasses.inputLabel}>Contraseña</span>
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="••••••••"
        className={classes(!!errors.password).input}
      />
      <span className={classes(!!errors.password).errorText}>{errors.password}</span>
      <label className="label">
        <a href="#" className="label-text-alt link link-hover text-stone-500 dark:text-stone-400 mt-1">¿Olvidaste tu contraseña?</a>
      </label>
    </div>

    <button type="submit" className={classes().button} disabled={isLoading}>
      Iniciar Sesión
    </button>
    <span className={classes(!!errors.button).errorText}>{errors.button}</span>
  </form>;
};