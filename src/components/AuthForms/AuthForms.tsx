import { Fragment, useState } from "react";

import { SignInForm } from "@components/SignInForm/SignInForm";
import { SignUpForm } from "@components/SignUpForm/SignUpForm";
import { cn, safeWindow } from "@lib/utils";

import { AuthTabs } from "./AuthFormTabs";

export const AuthForms = () => {
  const defaultTab = safeWindow()?.location.hash.split("#")[1] || AuthTabs.SignIn;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const classes = (isActive: boolean) => ({
    tab: cn("tab w-1/2", {
      "tab-active": isActive,
    }),
  });

  const handleTabClick = (tab: AuthTabs) => {
    setActiveTab(tab);

    const win = safeWindow();
    const isAuthPage = win?.location.pathname.includes("/auth");
    if (win && isAuthPage) win.location.hash = tab;

  };

  return <Fragment>
    <div className="tabs tabs-box bg-stone-200/50 dark:bg-stone-800/50 mb-6" role="tablist">
      <a role="tab" className={classes(activeTab === AuthTabs.SignIn).tab} id={AuthTabs.SignIn} onClick={() => handleTabClick(AuthTabs.SignIn)}>Iniciar Sesión</a>
      <a role="tab" className={classes(activeTab === AuthTabs.SignUp).tab} id={AuthTabs.SignUp} onClick={() => handleTabClick(AuthTabs.SignUp)}>Registrarse</a>
    </div>

    {activeTab === AuthTabs.SignIn && <SignInForm />}
    {activeTab === AuthTabs.SignUp && <SignUpForm />}

  </Fragment>;

};