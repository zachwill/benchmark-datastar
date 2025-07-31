import { serve } from "bun";
import datastar from "./pages/datastar.html";
import htmx from "./pages/htmx.html";
import idiomorph from "./pages/idiomorph.html";
import jquery from "./pages/jquery.html";

function fixture(size: "small" | "big") {
  const path = `./fixtures/${size}.html`;
  // Cached in memory by Bun
  return Bun.file(path).text();
}

serve({
  development: true,
  routes: {
    "/jquery": jquery,
    "/htmx": htmx,
    "/datastar": datastar,
    "/idiomorph": idiomorph,
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