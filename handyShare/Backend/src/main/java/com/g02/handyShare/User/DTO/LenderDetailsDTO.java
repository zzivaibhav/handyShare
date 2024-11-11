package com.g02.handyShare.User.DTO;

import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.User.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LenderDetailsDTO {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String pincode;
    private String imageData;
    private List<Product> products;
}
