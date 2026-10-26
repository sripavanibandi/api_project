const updates = [
  {
    id: 10,
    name: "Tata Sampann Unpolished Toor Dal (1kg)",
    description: "Rich in natural dietary protein, unpolished yellow pulses with no artificial polish",
    price: 175.0,
    quantity: 50,
    category: "Groceries",
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Amul Pure Cow Ghee (1L Tin)",
    description: "Traditional granular cow ghee with rich authentic golden aroma and essential fats",
    price: 620.0,
    quantity: 30,
    category: "Groceries",
    imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 21,
    name: "Levi's 511 Slim Fit Men's Jeans",
    description: "Classic dark indigo wash stretch denim, slim fit through seat and thigh with flex comfort",
    price: 2399.0,
    quantity: 20,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 22,
    name: "Allen Solly Men's Regular Fit Polo T-Shirt",
    description: "100% premium combed cotton pique polo with tipped collar and breathable weave",
    price: 999.0,
    quantity: 35,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"
  }
];

const newProducts = [
  // FASHION
  {
    name: "Nike Air Jordan 1 Retro Sneakers",
    description: "Iconic premium leather high-top silhouette, cushioned Air-Sole unit, durable rubber outsole",
    price: 9995.0,
    quantity: 15,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Zara Floral Print Summer Maxi Dress",
    description: "Lightweight breathable viscose fabric, sweetheart neckline with puffed sleeves and ruffled hem",
    price: 2990.0,
    quantity: 22,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ray-Ban Classic Polarized Aviator Sunglasses",
    description: "Timeless teardrop metal frames with crystal green G-15 UV protection lenses",
    price: 6890.0,
    quantity: 18,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Fossil Grant Chronograph Brown Leather Watch",
    description: "Classic roman numeral dial with stainless steel case and genuine supple brown leather strap",
    price: 8495.0,
    quantity: 12,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
  },

  // HOME & LIVING
  {
    name: "Prestige Omega Granite Non-Stick Cookware Set (3 Pcs)",
    description: "3-piece induction and gas compatible scratch-resistant granite non-stick fry pan, kadai, and tawa",
    price: 2499.0,
    quantity: 20,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ergonomic Mesh High-Back Office Chair",
    description: "Breathable mesh back with adjustable lumbar support, 2D armrests, and synchro-tilt mechanism",
    price: 8990.0,
    quantity: 10,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "SleepyCat Orthopedic Memory Foam Bed Pillow",
    description: "Contour ergonomic memory foam pillow with cooling gel layer and removable bamboo fiber cover",
    price: 1799.0,
    quantity: 28,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Iris Luxury Scented French Lavender Soy Wax Candle",
    description: "Handcrafted pure soy wax candle infused with calming natural French lavender essential oils",
    price: 699.0,
    quantity: 35,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80"
  },

  // BEAUTY & PERSONAL CARE
  {
    name: "Cetaphil Gentle Daily Skin Cleanser (250ml)",
    description: "Dermatologist-tested hydrating formula with Niacinamide and Vitamin B5 for sensitive skin",
    price: 475.0,
    quantity: 40,
    category: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "The Derma Co 10% Vitamin C Face Serum (30ml)",
    description: "Radiance booster with 10% pure Vitamin C, 5% Niacinamide and Ferulic acid for glowing skin",
    price: 580.0,
    quantity: 32,
    category: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "L'Oreal Paris Extraordinary Hair Serum (100ml)",
    description: "Enriched with 6 rare floral oils for intense shine, smooth nourishment, and heat protection",
    price: 499.0,
    quantity: 45,
    category: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Philips Series 3000 All-in-One Trimmer",
    description: "Self-sharpening stainless steel blades, 60 min runtime, 8-in-1 multi-attachments for beard & hair",
    price: 1699.0,
    quantity: 25,
    category: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80"
  },

  // SPORTS & FITNESS
  {
    name: "Boldfit Pro Hex Rubber Dumbbell Set (Pair 5kg)",
    description: "Solid cast iron core with anti-roll hexagonal rubber casing and knurled chrome steel handle",
    price: 1899.0,
    quantity: 20,
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Strauss Non-Slip Anti-Tear EVA Yoga Mat (6mm)",
    description: "High-density dual-textured cushioning for joint support, sweat-resistant with carry strap",
    price: 799.0,
    quantity: 30,
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Yonex Nanoray Light 18i Carbon Badminton Racket",
    description: "Ultra-lightweight 77g isometric carbon graphite frame, handles high string tensions up to 30 lbs",
    price: 2190.0,
    quantity: 16,
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=600&q=80"
  },

  // BOOKS & STATIONERY
  {
    name: "Atomic Habits by James Clear (Hardcover)",
    description: "The life-changing global bestseller on building good habits, breaking bad ones, and 1% improvements",
    price: 599.0,
    quantity: 50,
    category: "Books & Stationery",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Parker Vector Matte Black Fountain Pen",
    description: "Engineered with stainless steel nib and iconic arrow clip in timeless matte black finish",
    price: 449.0,
    quantity: 40,
    category: "Books & Stationery",
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Leuchtturm1917 Hardcover Dotted Journal (A5)",
    description: "251 numbered pages of ink-proof 80gsm paper with expandable pocket and dual ribbon bookmarks",
    price: 1290.0,
    quantity: 25,
    category: "Books & Stationery",
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80"
  }
];

async function run() {
  const baseUrl = "http://localhost:8081/products";

  console.log("1. Updating existing products with corrected, accurate images...");
  for (const item of updates) {
    try {
      const res = await fetch(`${baseUrl}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      console.log(`[UPDATED] #${item.id} ${item.name} -> HTTP ${res.status}`);
    } catch (err) {
      console.error(`[ERROR] Updating #${item.id}:`, err.message);
    }
  }

  console.log("\n2. Checking existing products to avoid duplicate additions...");
  const existingRes = await fetch(baseUrl);
  const existing = await existingRes.json();
  const existingNames = new Set(existing.map((p) => p.name.trim().toLowerCase()));

  console.log(`Currently ${existing.length} products in database.`);

  console.log("\n3. Adding new items in diverse categories...");
  for (const item of newProducts) {
    if (existingNames.has(item.name.trim().toLowerCase())) {
      console.log(`[SKIP] Already exists: ${item.name}`);
      continue;
    }

    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const created = await res.json();
      console.log(`[CREATED] #${created.id} [${created.category}] ${created.name} -> HTTP ${res.status}`);
    } catch (err) {
      console.error(`[ERROR] Adding ${item.name}:`, err.message);
    }
  }

  const finalRes = await fetch(baseUrl);
  const finalProducts = await finalRes.json();
  console.log(`\n✅ Finished! Total products now in database: ${finalProducts.length}`);
}

run();
