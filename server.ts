import { serve } from "bun";
import jqueryPage from "./pages/jquery.html";
import htmxPage from "./pages/htmx.html";
import datastarPage from "./pages/datastar.html";

function fixture(size: "small" | "big") {
  const path = `./fixtures/${size}.html`;
  // Cached in memory by Bun
  return Bun.file(path).text();
}

serve({
  development: true,
  routes: {
    "/jquery": jqueryPage,
    "/htmx": htmxPage,
    "/datastar": datastarPage,
    "/common.js": () => new Response(Bun.file("./pages/common.js"), { headers: { "content-type": "text/javascript" } }),

    // Endpoint the pages will call
    "/snippet/:size": async (req) => {
      const { size } = req.params;  // "small" | "big"
      const html = await fixture(size as any);
      return new Response(html, {
        headers: {
          "content-type": "text/html",
          "datastar-selector": "#target",
          "datastar-mode": "inner",
        }
      });
    }
  }
});

console.log("Bench server listening:", Bun.env.BUN_ORIGIN ?? "http://localhost:3000");