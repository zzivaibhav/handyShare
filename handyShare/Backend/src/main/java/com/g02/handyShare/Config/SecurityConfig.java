package com.g02.handyShare.Config;

import com.g02.handyShare.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

//    @Autowired
//    private final UserRepository userRepository;

//    @Autowired
//    private JwtRequestFilter jwtRequestFilter;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final AuthenticationProvider authenticationProvider;
//
//    @Bean
//    public UserDetailsService userDetailsService(){
//        return username ->{
//            return (UserDetails) userRepository.findByEmail(username)
//                    .orElseThrow(()->new UsernameNotFoundException("User not found"));
//        };
//    }


//    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, AuthenticationProvider authenticationProvider) {
//        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//        this.authenticationProvider = authenticationProvider;
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/user/register", "/api/v1/user/authenticate").permitAll()
                        .requestMatchers("/api/v1/demo-controller").authenticated()// Ensure demo-controller is secured
                        .anyRequest().authenticated() // Protect all other endpoints
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Use stateless sessions (JWT)
                )
                .authenticationProvider(authenticationProvider) // Set the authentication provider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter before authentication filter

        return http.build(); // Build the security configuration
    }

//    ------->THE INTENDED CODE<--------
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf->csrf.disable())
//                .authorizeHttpRequests(auth->
//                        auth.requestMatchers("/api/v1/user/register", "/api/v1/user/login").permitAll() // Allow access to the registration endpoint
//        //                        .anyRequest().authenticated() )
//                        .requestMatchers("")
//                        .permitAll()
//                        .anyRequest()
//                        .authenticated()
//
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//
////                .csrf(csrf -> csrf.disable())
////                .authorizeHttpRequests(auth -> auth
////                        .requestMatchers("/api/v1/user/register", "/api/v1/user/login").permitAll() // Allow access to the registration endpoint
////                        .anyRequest().authenticated() // Protect all other endpoints
////                )
////                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
////                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

//    @Bean
//    public InMemoryUserDetailsManager userDetailsService() {
//        UserDetails user = User.withUsername("admin")
//                .password(passwordEncoder().encode("password")) // Define your username and password here
//                .roles("USER") // Assign a role
//                .build();
//        return new InMemoryUserDetailsManager(user);
//    }

}
