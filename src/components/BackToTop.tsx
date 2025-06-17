import { FaChevronUp } from "react-icons/fa";


export const BackToTop = () => {

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return <button
    id="back-to-top"
    onClick={handleClick}
    className="btn btn-outline hover:btn-info btn-xs relative text-nowrap transition-colors duration-300 ease-in-out"
  >
    <span>Hacia arriba</span>
    <FaChevronUp />
  </button>;

};