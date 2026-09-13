package com.gramarogya.gramarogya_backend.exception;

import org.springframework.http.HttpStatus;

public class AuthenticationFailedException extends ApiException {

    public AuthenticationFailedException(String message) {
        super(
                HttpStatus.UNAUTHORIZED,
                ErrorCodes.INVALID_CREDENTIALS,
                message
        );
    }
}
