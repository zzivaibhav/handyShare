//package com.g02.handyShare.Product.Controller;
//
//import com.g02.handyShare.Product.Entity.Product;
//import com.g02.handyShare.Product.Service.ProductService;
//import com.g02.handyShare.User.Entity.User;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//
//class ProductControllerTest {
//
//    @Mock
//    private ProductService productService;
//
//    @InjectMocks
//    private ProductController productController;
//
//    public ProductControllerTest() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//
//    @Test
//    void testAddProducts_Positive() {
//        // Arrange
//        Product product = new Product();
//        product.setName("Test Product");
//        product.setCategory("Electronics");
//        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "dummy image data".getBytes());
//        ResponseEntity<?> mockResponse = ResponseEntity.status(HttpStatus.CREATED).body(product);
//
//        // Use explicit Object for ResponseEntity
//        when(productService.addProduct(any(Product.class), any(MultipartFile.class))).thenReturn(mockResponse);
//
//        // Act
//        ResponseEntity<?> response = productController.addProducts(product, file);
//
//        // Assert
//        assertEquals(HttpStatus.CREATED, response.getStatusCode());
//        verify(productService, times(1)).addProduct(any(Product.class), any(MultipartFile.class));
//    }
//
//    @Test
//    void testAddProducts_Negative() {
//        // Arrange
//        Product product = new Product();
//        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "dummy image data".getBytes());
//
//        when(productService.addProduct(any(Product.class), any(MockMultipartFile.class)))
//                .thenThrow(new RuntimeException("Error while adding product"));
//
//        // Act
//        ResponseEntity<?> response;
//        try {
//            response = productController.addProducts(product, file);
//        } catch (Exception e) {
//            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//        }
//
//        // Assert
//        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
//        verify(productService, times(1)).addProduct(any(Product.class), any(MockMultipartFile.class));
//    }
//
//    @Test
//    void testUpdateProduct_Positive() {
//        // Arrange
//        Long productId = 1L;
//        Product updatedProduct = new Product();
//        updatedProduct.setName("Updated Product");
//        MockMultipartFile file = new MockMultipartFile("image", "updated.jpg", "image/jpeg", "dummy updated image data".getBytes());
//
//        ResponseEntity<?> mockResponse = ResponseEntity.ok(updatedProduct);
//
//        when(productService.updateProduct(eq(productId), any(Product.class), any(MockMultipartFile.class)))
//                .thenReturn(mockResponse);
//
//        // Act
//        ResponseEntity<?> response = productController.updateProduct(productId, updatedProduct, file);
//
//        // Assert
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        verify(productService, times(1)).updateProduct(eq(productId), any(Product.class), any(MockMultipartFile.class));
//    }
//
//    @Test
//    void testUpdateProduct_Negative_ProductNotFound() {
//        // Arrange
//        Long productId = 1L;
//        Product updatedProduct = new Product();
//        MockMultipartFile file = new MockMultipartFile("image", "updated.jpg", "image/jpeg", "dummy updated image data".getBytes());
//
//        when(productService.updateProduct(eq(productId), any(Product.class), any(MockMultipartFile.class)))
//                .thenThrow(new RuntimeException("Product not found"));
//
//        // Act
//        ResponseEntity<?> response;
//        try {
//            response = productController.updateProduct(productId, updatedProduct, file);
//        } catch (Exception e) {
//            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//
//        // Assert
//        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//        verify(productService, times(1)).updateProduct(eq(productId), any(Product.class), any(MockMultipartFile.class));
//    }
//}