import { useEffect } from "react";
import { setBlogRead } from "@controllers/blogReads/blogReads";

export const PostAsyncHooks = () => {
  useEffect(() => {
    setBlogRead();
  }, []);

  return <div />;
};