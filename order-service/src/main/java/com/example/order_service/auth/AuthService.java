package com.example.order_service.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User register(
            String name,
            String email,
            String password
    ) {

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (password == null || password.length() < 6) {
            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        String hashedPassword =
                passwordEncoder.encode(password);

        User user = new User(
                name.trim(),
                normalizedEmail,
                hashedPassword
        );

        return userRepository.save(user);
    }

    public User login(
            String email,
            String password
    ) {

        User user = userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user);
    }
}