import { sharedClasses } from "@styles/sharedClasses";
import { AuthTabs } from "../AuthForms/AuthFormTabs";
import { useState } from "react";
import { cn } from "@lib/utils";
import { signUp } from "@controllers/signUp/signUp";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
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
    button: cn("btn btn-primary w-full bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 dark:text-black text-white border-0", {
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
      name: "",
      email: "",
      password: ""
    };

    if (formData.name.length < 5) newErrors.name = "El nombre debe tener al menos 5 caracteres";
    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El email no es válido";
    if (formData.password.length < 5) newErrors.password = "La contraseña debe tener al menos 5 caracteres";

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) return;

      await signUp(formData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <form id={AuthTabs.SignUp} className="space-y-4" onSubmit={handleSubmit}>
    <div className={classes().section}>
      <label className="label" htmlFor="name">
        <span className={sharedClasses.inputLabel}>Nombre completo</span>
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Tu nombre completo"
        className={classes(!!errors.name).input}
      />
      <span className={classes(!!errors.name).errorText}>{errors.name}</span>
    </div>

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
    </div>

    <button className={classes().button} disabled={isLoading}>
      Crear cuenta
    </button>
  </form>;
};