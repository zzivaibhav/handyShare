package com.g02.handyShare.Category.Repository;

import com.g02.handyShare.Category.Entity.Trending;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrendingRepository extends JpaRepository<Trending, Long> {
    List<Trending> findByProductCategory(String category);
}
