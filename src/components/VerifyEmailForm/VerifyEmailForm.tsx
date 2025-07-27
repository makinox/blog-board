import { useState, useEffect } from "react";
import { verifyEmail } from "@controllers/verifyEmail/verifyEmail";
import { safeWindow } from "@lib/utils";

export const VerifyEmailForm = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const token = safeWindow()?.location.search.split("token=")[1] || "";

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await verifyEmail({ token });

        if (response.success) {
          setStatus("success");
          setMessage(response.message);

        } else {
          setStatus("error");
          setMessage(response.message || "Error al verificar el email");
        }
      } catch (error) {
        setStatus("error");
        console.error("Error verifying email:", error);
      }
    };

    if (token) verifyEmailToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Verificando tu email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
          ¡Email verificado exitosamente!
        </h2>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Error al verificar el email
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
    </div>
  );
}; 