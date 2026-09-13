package com.gramarogya.gramarogya_backend.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super(
                HttpStatus.FORBIDDEN,
                ErrorCodes.ACCESS_DENIED,
                message
        );
    }
}
