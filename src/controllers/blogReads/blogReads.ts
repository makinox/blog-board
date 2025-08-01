import { globalController } from "@controllers/globalController/globalController";
import { getCurrentBlogUrl, getVisitorId } from "@lib/utils";

const path = "/blog-reads";

export const setBlogRead = () => {
  const visitor_id = getVisitorId();
  const page_url = getCurrentBlogUrl();
  
  if (!visitor_id) return;


  return globalController(path, "POST", {
    page_url,
    visitor_id,
  });
};