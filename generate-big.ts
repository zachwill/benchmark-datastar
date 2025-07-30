import { write, file } from "bun";

// Path to the HTML file
const htmlPath = "./fixtures/big.html";

// Load the whole file as text
let html = await file(htmlPath).text();

// Locate the snippet block
const startIdx = html.indexOf('<div id="snippet">');
const endIdx = html.indexOf("</div>", startIdx);
if (startIdx === -1 || endIdx === -1)
  throw new Error("Couldn't find <div id=\"snippet\"> block");

// Build 5 000 <p> tags
let snippet = '  <div id="snippet">\n';
for (let i = 1; i <= 5000; i++) snippet += `    <p id="p-${i}">Content ${i}</p>\n`;
snippet += "  </div>";

// Splice the new snippet back into the page
html = html.slice(0, startIdx) + snippet + html.slice(endIdx + 6); // +6 to skip "</div>"

// Write the updated HTML
await write(htmlPath, html);
console.log("fixtures/big.html updated with 5 000 <p> elements ✔");