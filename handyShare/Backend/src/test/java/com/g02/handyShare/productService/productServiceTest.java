package com.g02.handyShare.productService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.stereotype.*;

import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.Product.Repository.ProductRepository;
import com.g02.handyShare.Product.Service.ProductService;

@RunWith(MockitoJUnitRunner.class)
public class productServiceTest{
    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;
   
    @Test
    public void  getProductById(){
       
        Product product = new Product();
        product.setCategory("Electronics");
        product.setId((long) 12);
        product.setName("USB");
when(this.productRepository.findById(product.getId())).thenReturn(Optional.of(product));
         Product actual =    productService.getProductById(product.getId());
assertEquals(product,actual);;
    }


}