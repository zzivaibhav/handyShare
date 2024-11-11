package com.g02.handyShare.borrow;

import com.g02.handyShare.Product.Service.CustomException;
import com.g02.handyShare.User.Repository.UserRepository;
import com.g02.handyShare.borrow.entity.Borrow;
import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.Product.Repository.ProductRepository;
import com.g02.handyShare.borrow.repository.BorrowRepository;
import com.g02.handyShare.borrow.service.BorrowService;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BorrowServiceTest {

    @InjectMocks
    private BorrowService borrowService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;
    @Mock
    private BorrowRepository borrowRepository;



    private User user;
    private Product product;
    private Borrow borrowInstance;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");

        product = new Product();
        product.setId(1L);
        product.setAvailable(true);

        borrowInstance = new Borrow();
        borrowInstance.setProduct(product);
        borrowInstance.setDuration(24);

        MockitoAnnotations.openMocks(this);

        // Set up the SecurityContext to return the mocked Authentication
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Ensure that the authentication mock is not null and configured correctly
        when(authentication.getName()).thenReturn("john@gmail.com");
    }

    @Test
    void testAddBorrowTransaction_Success() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));
        when(borrowRepository.save(any(Borrow.class))).thenReturn(borrowInstance);

        // Act
        Borrow result = borrowService.addBorrowTransaction(borrowInstance);

        // Assert
        assertNotNull(result);
        assertEquals(user, result.getBorrower());
        assertFalse(product.getAvailable());
        assertNotNull(result.getTimerStart());
        assertNotNull(result.getTimerEnd());
        verify(borrowRepository, times(2)).save(any(Borrow.class));
    }

    @Test
    void testAddBorrowTransaction_ProductNotFound() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        when(productRepository.findById(product.getId())).thenReturn(Optional.empty());

        // Act and Assert
        assertThrows(CustomException.class, () -> borrowService.addBorrowTransaction(borrowInstance));
    }
}