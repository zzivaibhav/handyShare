package com.g02.handyShare.User.Repository;
import java.util.Optional;
import com.g02.handyShare.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


    User findByVerificationToken(String token);


    Optional<User> findByEmail(String userEmail);

}
