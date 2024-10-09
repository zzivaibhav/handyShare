package com.g02.handyShare.Category.Controller;

import com.g02.handyShare.Category.Repository.CategoryRepository;
import com.g02.handyShare.Category.Model.Category;
import com.g02.handyShare.Category.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // Create new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Map<String, Object> categoryData) {
        Category category = new Category();

        // Set the basic fields
        category.setName((String) categoryData.get("name"));
        category.setDescription((String) categoryData.get("description"));

        // Handle the parent category ID
        if (categoryData.containsKey("parent_category_id")) {
            Long parentCategoryId = Long.valueOf(categoryData.get("parent_category_id").toString());
            Optional<Category> parentCategory = categoryRepository.findById(parentCategoryId);
            if (parentCategory.isPresent()) {
                category.setParentCategory(parentCategory.get());  // Set the parent category
            } else {
                throw new RuntimeException("Parent category not found");
            }
        }

        Category savedCategory = categoryRepository.save(category);  // Save the new category

        // Return 201 Created status and the URI of the newly created category
        return ResponseEntity
                .created(URI.create("/api/v1/categories/" + savedCategory.getCategoryId()))
                .body(savedCategory);
    }


    // Get a Category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable(value = "id") Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok().body(category);
    }

    // Get All Categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Update a Category
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable(value = "id") Long categoryId,
                                                   @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setIsActive(categoryDetails.getIsActive());
        category.setParentCategory(categoryDetails.getParentCategory());
        category.setSortOrder(categoryDetails.getSortOrder());

        final Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    // Delete a Category
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable(value = "id") Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);
        return ResponseEntity.ok().build();
    }

    // Get All Categories with their Subcategories
    @GetMapping("/tree")
    public List<Category> getCategoryTree() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .filter(category -> category.getParentCategory() == null)  // Only parent categories
                .peek(parent -> parent.setSubCategories(getSubCategories(parent.getCategoryId(), allCategories)))
                .toList();
    }

    private List<Category> getSubCategories(Long parentId, List<Category> allCategories) {
        return allCategories.stream()
                .filter(category -> category.getParentCategory() != null && category.getParentCategory().getCategoryId().equals(parentId))
                .toList();
    }

}