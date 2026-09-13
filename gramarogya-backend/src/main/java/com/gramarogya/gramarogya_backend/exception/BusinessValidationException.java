package com.gramarogya.gramarogya_backend.exception;

import org.springframework.http.HttpStatus;

public class BusinessValidationException extends ApiException {
    public BusinessValidationException(String message) {
        this(ErrorCodes.BAD_REQUEST, message);
    }

    public BusinessValidationException(String errorCode, String message) {
        super(
                HttpStatus.BAD_REQUEST,
                errorCode,
                message
        );
    }
}
