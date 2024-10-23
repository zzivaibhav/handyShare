package com.g02.handyShare.Product.Service;

import com.g02.handyShare.Category.Entity.Category;
import com.g02.handyShare.Config.Firebase.FirebaseService;
import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.Product.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

      private FirebaseService firebaseService;

    @Autowired
    public void Controller(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    // Add multiple products
    public List<Product> addProduct(List<Product> products) {
        return productRepository.saveAll(products);
    }

    //update product entries
//    public Product updateProduct(Long id, Product updatedProduct){
//        Optional<Product> existingProductOptional=productRepository.findById(id);
//
//        if (existingProductOptional.isPresent()){
//            Product existingProduct=existingProductOptional.get();
//            //update fields
//            existingProduct.setName(updatedProduct.getName());
//            existingProduct.setDescription(updatedProduct.getDescription());
//            existingProduct.setCategory(updatedProduct.getCategory());
//            existingProduct.setRentalPrice(updatedProduct.getRentalPrice());
//            existingProduct.setAvailable(updatedProduct.getAvailable());
//
//            return productRepository.save(existingProduct);
//        }else{
//            throw new CustomException("Product not found with id: "+ id);
//        }
//    }

    public Product getProductById(Long id){
        return productRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Product not Found!"));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    //delete product
    public boolean deleteProduct(Long productId){
        if(productRepository.existsById(productId)){
            productRepository.deleteById(productId);
            return true;
        }else {
            return false;
        }
    }

    public List<Product> getNewlyAddedProductsByCategory(String category) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return productRepository.findNewlyAddedProductsByCategory(category, oneWeekAgo);
    }

    public ResponseEntity<?> addProduct(Product product, MultipartFile file) {
        //NO NEED TO DO THIS USING THE AUTHENTICATION MANAGER WE DIRECTLY CAPTURE THE USER ID.
        // if (product.getUserId() == null) {
        //     throw new CustomException("User ID is required for adding a product.");
        // }
        try{String imageUrl = firebaseService.uploadFile(file, "product_images");
        Product tobeSaved = new Product();
      // tobeSaved.setAvailable(true);
        tobeSaved.setCategory(product.getCategory());
        tobeSaved.setDescription(product.getDescription());
        tobeSaved.setProductImage(imageUrl);
        tobeSaved.setRentalPrice(product.getRentalPrice());
        tobeSaved.setName(product.getName());
        Product saved = productRepository.save(tobeSaved);
        return ResponseEntity.ok().body(saved);
       }catch(IOException e){
            return ResponseEntity.internalServerError().body("ERROR WHILE ADDING YOUR PRODUCT, PLEASE TRY AGAIN AFTER SOME TIME.");
        }
        
       
    }
}
