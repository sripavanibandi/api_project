async function updateAll() {
  const res = await fetch("http://localhost:8081/products");
  const products = await res.json();

  console.log(`Updating ${products.length} products to use verified local product-images...`);
  for (const p of products) {
    p.imageUrl = `/product-images/${p.id}.jpg`;
    const putRes = await fetch(`http://localhost:8081/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    });
    console.log(`[UPDATED] #${p.id} ${p.name} -> imageUrl: ${p.imageUrl} (HTTP ${putRes.status})`);
  }
  console.log("All products updated successfully!");
}

updateAll();
