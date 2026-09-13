package com.gramarogya.gramarogya_backend.exception;

import org.springframework.http.HttpStatus;

public class AuthenticationRequiredException extends ApiException {

    public AuthenticationRequiredException(String message) {
        super(
                HttpStatus.UNAUTHORIZED,
                ErrorCodes.AUTHENTICATION_REQUIRED,
                message
        );
    }
}
