async function run() {
  const res = await fetch("http://localhost:8080/products", {
    headers: { "X-API-KEY": "ecommerce-secret-key" }
  });
  const products = await res.json();

  for (const p of products) {
    const match = p.imageUrl.match(/photo-([0-9a-zA-Z-]+)/);
    const photoId = match ? match[1] : null;
    let unsplashTitle = "N/A";

    if (photoId) {
      try {
        const photoRes = await fetch("https://unsplash.com/photos/" + photoId, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const html = await photoRes.text();
        const m = html.match(/<title>([^<]+)<\/title>/);
        if (m) {
          unsplashTitle = m[1].replace(" | Unsplash", "").trim();
        }
      } catch (err) {
        unsplashTitle = "FETCH_ERR: " + err.message;
      }
    }

    console.log(`[#${p.id}] [${p.category}] "${p.name}"`);
    console.log(`    Actual Photo: ${unsplashTitle}`);
    console.log(`    URL: ${p.imageUrl}\n`);
  }
}

run();
