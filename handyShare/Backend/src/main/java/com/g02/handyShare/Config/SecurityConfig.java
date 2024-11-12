package com.g02.handyShare.Config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.g02.handyShare.Constants;
import com.g02.handyShare.Config.Jwt.JwtFilter;
import com.g02.handyShare.Config.Jwt.JwtUtil;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    @Autowired
    private Constants constant;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .authorizeHttpRequests(auth -> auth
                        // Allow public access to these endpoints
                        .requestMatchers("/signup", "/api/v1/all/**", "/api/v1/all/payment/checkout-session", 
                                         "/api/v1/all/forgot-password/**", "/api/v1/all/change-password/**", "/genToken").permitAll()
                        
                        // Admin-specific endpoints
                        .requestMatchers("/api/v1/admin/**").hasAuthority("admin")

                        // User-specific endpoints
                        .requestMatchers("/api/v1/user/**").hasAnyAuthority("user", "admin")

                        // Ensure the /api/v1/user/review-create endpoint is accessible
                        .requestMatchers(HttpMethod.POST, "/api/v1/user/review-create").authenticated()

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/homepage", true) // Redirect to homepage on success
                        .successHandler(new AuthenticationSuccessHandler() {
                            @Override
                            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                                Authentication authentication) throws IOException, ServletException {
                                OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
                                OAuth2User user = authToken.getPrincipal();
                                String email = user.getAttribute("email");

                                User existingUser = userRepo.findByEmail(email);
                                if (existingUser == null) {
                                    User newUser = new User();
                                    newUser.setEmail(email);
                                    newUser.setPassword(passwordEncoder().encode("admin@123"));
                                    newUser.setImageData(user.getAttribute("picture"));
                                    newUser.setName(user.getAttribute("name"));
                                    newUser.set_email_verified(true);
                                    userRepo.save(newUser);
                                }

                                String token = jwtUtil.generateToken(email);
                                logger.info("User email after successful OAuth2 login: {}, token: {}", email, token);
                                response.sendRedirect(constant.FRONT_END_HOST + "/homepage?token=" + token);
                            }
                        })
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless JWT-based authentication
                .formLogin(formLogin -> formLogin.disable()) // Disable form-based login
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
                .addFilterBefore(new CorsFilter(), ChannelProcessingFilter.class); // Add CORS filter

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}