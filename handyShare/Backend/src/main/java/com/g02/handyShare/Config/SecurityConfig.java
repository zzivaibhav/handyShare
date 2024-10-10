package com.g02.handyShare.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection for simplicity, but be cautious with this in production
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/user/register").permitAll() // Allow access to the registration endpoint
                        .anyRequest().authenticated() // Protect all other endpoints
                )
                .formLogin(form -> form // Configure form-based login
                        .loginPage("/login") // To specify own login page
                        .permitAll() // Allow everyone to access the login page
                );

        return http.build();
    }
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails user = User.withUsername("admin")
                .password(passwordEncoder().encode("password")) // Define your username and password here
                .roles("USER") // Assign a role
                .build();
        return new InMemoryUserDetailsManager(user);
    }

}
