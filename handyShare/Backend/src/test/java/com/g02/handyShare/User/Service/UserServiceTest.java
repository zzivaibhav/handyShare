package com.g02.handyShare.User.Service;

import com.g02.handyShare.Product.Service.ProductService;
import com.g02.handyShare.User.DTO.LenderDetailsDTO;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.User.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private UserService userService;

    @Test
    void getLenderDetails_ShouldReturnLenderDetailsDTO() {
        // Arrange
        Long lenderId = 1L;
        User lender = new User();
        lender.setId(lenderId);
        lender.setName("Jane Doe");
        lender.setEmail("jane@example.com");
        lender.setAddress("123 Main St");
        lender.setPhone("555-1234");
        lender.setPincode("123456");
        lender.setImageData("http://example.com/image.jpg");

        List<Product> products = Arrays.asList(
                new Product(/* initialize as needed */),
                new Product(/* initialize as needed */)
        );

        when(userRepository.findById(lenderId)).thenReturn(Optional.of(lender));
        when(productService.getProductsByLenderEmail(lender.getEmail())).thenReturn(products);

        // Act
        LenderDetailsDTO result = userService.getLenderDetails(lenderId);

        // Assert
        assertNotNull(result);
        assertEquals(lenderId, result.getId());
        assertEquals("Jane Doe", result.getName());
        assertEquals("jane@example.com", result.getEmail());
        assertEquals("123 Main St", result.getAddress());
        assertEquals("555-1234", result.getPhone());
        assertEquals("123456", result.getPincode());
        assertEquals("http://example.com/image.jpg", result.getImageData());
        assertEquals(products, result.getProducts());
    }

    @Test
    void getLenderDetails_ShouldThrowException_WhenLenderNotFound() {
        // Arrange
        Long lenderId = 2L;
        when(userRepository.findById(lenderId)).thenReturn(Optional.empty());
        // Act & Assert
        assertThrows(RuntimeException.class, () -> userService.getLenderDetails(lenderId));
    }
}
