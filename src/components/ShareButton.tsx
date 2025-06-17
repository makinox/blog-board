import { useState } from "react";
import { FaShare, FaLink } from "react-icons/fa";

export const ShareButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    navigator.clipboard.writeText(window.location.href);

    setTimeout(() => { setIsClicked(false); }, 2000);
  };

  return <button onClick={handleClick} className="btn btn-outline hover:btn-success btn-xs relative text-nowrap transition-all duration-300 ease-in-out">
    {isClicked ?
      <>
        <span>Link copiado</span>
        <FaLink />
      </>
      :
      <>
        <span>Compartir</span>
        <FaShare />
      </>
    }

  </button>;
};