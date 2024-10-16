package com.g02.handyShare.Product.Service;

import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.Product.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Add multiple products
    public List<Product> addProduct(List<Product> products) {
        return productRepository.saveAll(products);
    }

    // Update product entries
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    // Update fields
                    existingProduct.setName(updatedProduct.getName());
                    existingProduct.setDescription(updatedProduct.getDescription());
                    existingProduct.setCategory(updatedProduct.getCategory());
                    existingProduct.setRentalPrice(updatedProduct.getRentalPrice());
                    existingProduct.setAvailable(updatedProduct.getAvailable());
                    return productRepository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    // Delete product
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
