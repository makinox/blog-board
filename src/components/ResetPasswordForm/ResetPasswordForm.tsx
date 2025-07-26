import { useState, useEffect } from "react";

import { sharedClasses } from "@styles/sharedClasses";
import { resetPassword } from "@controllers/resetPassword/resetPassword";
import { cn } from "@lib/utils";

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    button: ""
  });

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get("token"));
  }, []);

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
      newPassword: "",
      confirmPassword: "",
      button: ""
    };

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) return;

      if (!token) {
        setErrors({
          ...errors,
          button: "Invalid reset token"
        });
        return;
      }

      const response = await resetPassword({
        token,
        newPassword: formData.newPassword
      });

      if (response.success) {
        setIsSuccess(true);
      } else {
        setErrors({
          ...errors,
          button: response.message || "Error changing password"
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setErrors({
        ...errors,
        button: "Error changing password"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Invalid Token</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-4">
          The link to reset your password is invalid or has expired.
        </p>
        <a href="/auth" className="btn btn-primary">
          Back to login
        </a>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Password Changed!</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-4">
          Your password has been changed successfully. You can now log in with your new password.
        </p>
        <a href="/auth" className="btn btn-primary">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <form data-testid="reset-password-form" className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
          Change Password
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Enter your new password
        </p>
      </div>

      <div className={classes().section}>
        <label className="label" htmlFor="newPassword">
          <span className={sharedClasses.inputLabel}>New Password</span>
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          className={classes(!!errors.newPassword).input}
        />
        <span className={classes(!!errors.newPassword).errorText}>{errors.newPassword}</span>
      </div>

      <div className={classes().section}>
        <label className="label" htmlFor="confirmPassword">
          <span className={sharedClasses.inputLabel}>Confirm Password</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          className={classes(!!errors.confirmPassword).input}
        />
        <span className={classes(!!errors.confirmPassword).errorText}>{errors.confirmPassword}</span>
      </div>

      <button type="submit" className={classes().button} disabled={isLoading}>
        {isLoading ? "Changing..." : "Change Password"}
      </button>
      <span className={classes(!!errors.button).errorText}>{errors.button}</span>

      <div className="text-center mt-4">
        <a href="/auth" className="link link-hover text-stone-500 dark:text-stone-400">
          ← Back to login
        </a>
      </div>
    </form>
  );
}; 