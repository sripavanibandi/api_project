package com.example.product_service.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.product_service.model.Product;
import com.example.product_service.repository.ProductRepository;

@Component
public class ProductDataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductDataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        seedNewProductsIfMissing();

        // Ensure all products point to their verified, high-resolution local product images
        List<Product> all = productRepository.findAll();
        for (Product p : all) {
            String localUrl = "/product-images/" + p.getId() + ".jpg";
            if (p.getImageUrl() == null || !p.getImageUrl().startsWith("/product-images/")) {
                p.setImageUrl(localUrl);
                productRepository.save(p);
            }
        }
    }

    private void seedNewProductsIfMissing() {
        if (!productRepository.existsByName("Apple AirPods Pro (2nd Generation)")) {
            productRepository.save(new Product("Apple AirPods Pro (2nd Generation)", "Active Noise Cancellation, Adaptive Audio, Transparency mode, MagSafe USB-C charging case", 24900.0, 20, "Electronics", "/product-images/43.jpg"));
        }
        if (!productRepository.existsByName("Molten FIVB Official Soft Touch Leather Volleyball")) {
            productRepository.save(new Product("Molten FIVB Official Soft Touch Leather Volleyball", "Official FIVB approved competition volleyball with premium soft-touch polyurethane leather panels", 1899.0, 25, "Sports & Fitness", "/product-images/44.jpg"));
        }
        if (!productRepository.existsByName("Adidas Teamgeist FIFA Official Match Football (Size 5)")) {
            productRepository.save(new Product("Adidas Teamgeist FIFA Official Match Football (Size 5)", "Iconic FIFA approved 14-panel thermal bonded match soccer ball for precision flight and control", 2999.0, 22, "Sports & Fitness", "/product-images/45.jpg"));
        }
        if (!productRepository.existsByName("Roadster Men's Genuine Distressed Leather Biker Jacket")) {
            productRepository.save(new Product("Roadster Men's Genuine Distressed Leather Biker Jacket", "100% genuine vintage finish leather with dual zip pockets, snap collar, and quilted warm inner lining", 5499.0, 15, "Fashion", "/product-images/46.jpg"));
        }
        if (!productRepository.existsByName("Sunbeam Stainless Steel 2-Slice Pop-Up Toaster")) {
            productRepository.save(new Product("Sunbeam Stainless Steel 2-Slice Pop-Up Toaster", "Classic mirror-finish chrome design with 6-setting browning dial, defrost, reheat, and high-lift lever", 1890.0, 30, "Home & Living", "/product-images/47.jpg"));
        }
        if (!productRepository.existsByName("Calvin Klein CK One Eau de Toilette (100ml)")) {
            productRepository.save(new Product("Calvin Klein CK One Eau de Toilette (100ml)", "Iconic unisex citrus green fragrance with refreshing top notes of bergamot, cardamom, and green tea", 4250.0, 35, "Beauty & Personal Care", "/product-images/48.jpg"));
        }
        if (!productRepository.existsByName("The Great Gatsby by F. Scott Fitzgerald (Collector's Hardcover)")) {
            productRepository.save(new Product("The Great Gatsby by F. Scott Fitzgerald (Collector's Hardcover)", "Classic 1925 masterpiece edition with original celestial eyes dust jacket artwork and gold gilded spine", 499.0, 50, "Books & Stationery", "/product-images/49.jpg"));
        }
        if (!productRepository.existsByName("Ferrero Nutella Hazelnut Cocoa Spread (400g)")) {
            productRepository.save(new Product("Ferrero Nutella Hazelnut Cocoa Spread (400g)", "Authentic creamy hazelnut chocolate spread crafted with selected roasted hazelnuts and skimmed milk", 345.0, 60, "Groceries", "/product-images/50.jpg"));
        }
    }
}
