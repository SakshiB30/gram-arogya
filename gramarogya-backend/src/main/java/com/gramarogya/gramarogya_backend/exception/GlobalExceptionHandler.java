package com.gramarogya.gramarogya_backend.exception;

import com.gramarogya.gramarogya_backend.dto.ApiErrorResponse;
import jakarta.validation.ConstraintViolationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    // =====================================================
    // APPLICATION EXCEPTIONS
    // =====================================================

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(
            ApiException exception,
            HttpServletRequest request) {

        return buildResponse(
                exception.getStatus(),
                exception.getErrorCode(),
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }


    // =====================================================
    // SPRING SECURITY
    // =====================================================

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(
            AuthenticationException exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                ErrorCodes.AUTHENTICATION_REQUIRED,
                "Please sign in to continue.",
                request.getRequestURI(),
                null
        );
    }


    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleSpringAccessDenied(
            org.springframework.security.access.AccessDeniedException exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.FORBIDDEN,
                ErrorCodes.ACCESS_DENIED,
                "You don't have permission to perform this action.",
                request.getRequestURI(),
                null
        );
    }


    // =====================================================
    // VALIDATION ERRORS
    // =====================================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        Map<String, String> validationErrors =
                new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        validationErrors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCodes.VALIDATION_ERROR,
                "Please provide all required fields.",
                request.getRequestURI(),
                validationErrors
        );
    }


    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException exception,
            HttpServletRequest request) {

        Map<String, String> validationErrors =
                new HashMap<>();

        exception.getConstraintViolations()
                .forEach(violation ->
                        validationErrors.put(
                                violation.getPropertyPath().toString(),
                                violation.getMessage()
                        )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCodes.VALIDATION_ERROR,
                "Please provide all required fields.",
                request.getRequestURI(),
                validationErrors
        );
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableMessage(
            HttpMessageNotReadableException exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCodes.BAD_REQUEST,
                "Please check the request data and try again.",
                request.getRequestURI(),
                null
        );
    }


    // =====================================================
    // ILLEGAL ARGUMENT
    // =====================================================

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(
            IllegalArgumentException exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCodes.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }


    // =====================================================
    // GENERIC EXCEPTION
    // =====================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception exception,
            HttpServletRequest request) {

        log.error(
                "Unhandled exception while processing {}",
                request.getRequestURI(),
                exception
        );

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCodes.INTERNAL_ERROR,
                "Something went wrong while processing your request. Please try again.",
                request.getRequestURI(),
                null
        );
    }


    // =====================================================
    // COMMON RESPONSE BUILDER
    // =====================================================

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            String errorCode,
            String message,
            String path,
            Map<String, String> errors) {

        ApiErrorResponse response =
                ApiErrorResponse.builder()
                        .success(false)
                        .timestamp(LocalDateTime.now())
                        .status(status.value())
                        .error(errorCode)
                        .message(message)
                        .path(path)
                        .errors(errors)
                        .build();

        return ResponseEntity
                .status(status)
                .body(response);
    }
}
