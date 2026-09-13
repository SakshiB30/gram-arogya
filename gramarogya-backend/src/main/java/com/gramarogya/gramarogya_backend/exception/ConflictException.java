package com.gramarogya.gramarogya_backend.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends ApiException {

    public ConflictException(String message) {
        this(ErrorCodes.CONFLICT, message);
    }

    public ConflictException(String errorCode, String message) {
        super(
                HttpStatus.CONFLICT,
                errorCode,
                message
        );
    }
}
