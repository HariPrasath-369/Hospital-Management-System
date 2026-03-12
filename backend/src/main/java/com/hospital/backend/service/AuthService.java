package com.hospital.backend.service;

import com.hospital.backend.dto.Dtos.AuthResponse;
import com.hospital.backend.dto.Dtos.LoginRequest;
import com.hospital.backend.dto.Dtos.RegisterRequest;
import com.hospital.backend.exception.BadRequestException;
import com.hospital.backend.model.Role;
import com.hospital.backend.model.User;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .specialization(request.getSpecialization())
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();
        var jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
