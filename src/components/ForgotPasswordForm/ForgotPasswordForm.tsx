import { useState } from "react";

import { sharedClasses } from "@styles/sharedClasses";
import { forgotPassword } from "@controllers/forgotPassword/forgotPassword";
import { cn } from "@lib/utils";

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is not valid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail()) return;
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });

      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message || "Error sending email");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError("Error sending reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Email Sent!</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-4">
          We have sent a link to reset your password to <strong>{email}</strong>.
          Check your inbox and follow the instructions.
        </p>
        <a href="/auth" className="btn btn-primary">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <form data-testid="forgot-password-form" className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
          Forgot your password?
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <div className={classes().section}>
        <label className="label" htmlFor="email">
          <span className={sharedClasses.inputLabel}>Email</span>
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          className={classes(!!error).input}
        />
        <span className={classes(!!error).errorText} data-testid="email-error">{error}</span>
      </div>

      <button type="submit" className={classes().button} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Email"}
      </button>

      <div className="text-center mt-4">
        <a href="/auth" className="link link-hover text-stone-500 dark:text-stone-400">
          ← Back to login
        </a>
      </div>
    </form>
  );
}; 