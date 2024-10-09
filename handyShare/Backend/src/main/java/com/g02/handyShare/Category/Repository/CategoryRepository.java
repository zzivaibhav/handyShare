package com.g02.handyShare.Category.Repository;

import com.g02.handyShare.Category.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
