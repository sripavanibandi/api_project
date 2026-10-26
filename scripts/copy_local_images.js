const fs = require("fs");
const path = require("path");

const artifactDir = "C:\\Users\\sripa\\.gemini\\antigravity-ide\\brain\\1cd349ad-8e74-4539-8c0d-a4bde9d2968d";
const publicImagesDir = path.join(__dirname, "..", "frontend", "public", "product-images");

const replacements = {
  10: "toor_dal_1792902594305.jpg",
  11: "sunflower_oil_1792902938903.jpg",
  13: "wheat_atta_1792902976079.jpg",
  14: "ghee_jar_1792902560267.jpg",
  21: "levis_jeans_1792902623349.jpg",
  22: "polo_shirt_1792902653044.jpg",
  29: "cookware_set_1792902685077.jpg",
  30: "office_chair_1792902719101.jpg",
  34: "face_serum_1792902750586.jpg",
  35: "hair_serum_1792902782954.jpg",
  36: "beard_trimmer_1792902831606.jpg",
  39: "badminton_racket_1792902864412.jpg",
  40: "atomic_habits_1792902901526.jpg"
};

for (const [id, filename] of Object.entries(replacements)) {
  const src = path.join(artifactDir, filename);
  const dest = path.join(publicImagesDir, `${id}.jpg`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[COPIED] ${filename} -> ${id}.jpg`);
  } else {
    console.log(`[NOT FOUND] ${src}`);
  }
}
