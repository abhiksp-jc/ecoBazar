import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls the browser window to top (0, 0)
 * whenever the route pathname or search parameters change.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
