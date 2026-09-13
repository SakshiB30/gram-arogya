package com.gramarogya.gramarogya_backend.config;

import com.gramarogya.gramarogya_backend.exception.ErrorCodes;
import com.gramarogya.gramarogya_backend.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.LocalDateTime;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    buildErrorBody(
                                            HttpServletResponse.SC_UNAUTHORIZED,
                                            ErrorCodes.AUTHENTICATION_REQUIRED,
                                            "Please sign in to continue.",
                                            request.getRequestURI()
                                    )
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    buildErrorBody(
                                            HttpServletResponse.SC_FORBIDDEN,
                                            ErrorCodes.ACCESS_DENIED,
                                            "You don't have permission to perform this action.",
                                            request.getRequestURI()
                                    )
                            );
                        })
                )

                .authorizeHttpRequests(auth -> auth

                        // Public APIs
                        .requestMatchers(
                                "/auth/**",
                                "/asha/register"
                        ).permitAll()

                        // ADMIN APIs
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // ANM APIs
                        .requestMatchers("/anm/**").hasRole("ANM")

                        // ASHA APIs
                        .requestMatchers("/asha/**").hasRole("ASHA")

                        // Everything else
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    private String buildErrorBody(
            int status,
            String error,
            String message,
            String path) {

        return """
                {"success":false,"timestamp":"%s","status":%d,"error":"%s","message":"%s","path":"%s"}
                """.formatted(
                LocalDateTime.now(),
                status,
                escapeJson(error),
                escapeJson(message),
                escapeJson(path)
        );
    }

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}
