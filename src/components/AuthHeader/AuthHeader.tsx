import { useEffect, useState } from "react";

import { useAuthStore } from "@stores/authStore";
import { safeWindow } from "@lib/utils";

interface AuthHeaderProps {
  redirectIfAuthenticated?: boolean;
}

export const AuthHeader = ({
  redirectIfAuthenticated = true
}: AuthHeaderProps) => {
  const { user } = useAuthStore();
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!user && retry < 3) {
      setTimeout(() => setRetry((prev) => prev + 1), 1000);
      return;
    }
    if (user && redirectIfAuthenticated) {
      const win = safeWindow();
      if (win) win.location.href = "/";
      return;
    }
    if (!user && !redirectIfAuthenticated) {
      const win = safeWindow();
      if (win) win.location.href = "/auth";
      return;
    }
  }, [retry, user]);
};