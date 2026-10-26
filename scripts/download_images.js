const fs = require("fs");
const path = require("path");

async function downloadAll() {
  const dir = path.join(__dirname, "..", "frontend", "public", "product-images");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const res = await fetch("http://localhost:8080/products", {
    headers: { "X-API-KEY": "ecommerce-secret-key" }
  });
  const products = await res.json();

  console.log(`Downloading images for ${products.length} products...`);
  for (const p of products) {
    const dest = path.join(dir, `${p.id}.jpg`);
    try {
      const imgRes = await fetch(p.imageUrl);
      if (!imgRes.ok) {
        console.log(`[ERR ${imgRes.status}] #${p.id} ${p.name}`);
        continue;
      }
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`[SAVED] #${p.id} ${p.name} (${buffer.length} bytes)`);
    } catch (e) {
      console.log(`[FAIL] #${p.id} ${p.name}: ${e.message}`);
    }
  }
  console.log("Done downloading all images!");
}

downloadAll();
