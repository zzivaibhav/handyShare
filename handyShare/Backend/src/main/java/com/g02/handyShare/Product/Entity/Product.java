package com.g02.handyShare.Product.Entity;

import com.g02.handyShare.Category.Entity.Trending;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Product name is required.")
    private String name;

    @NotBlank(message="Description is required.")
    private String description;

    @NotBlank(message="Category is required.")
    private String category;

    @NotNull(message="Rental Price is required.")
    private Double rentalPrice;

    @NotNull(message="Availability is required.")
    private Boolean available;


}
