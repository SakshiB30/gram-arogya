package com.gramarogya.gramarogya_backend.exception;

import org.springframework.http.HttpStatus;

public class AccountStateException extends ApiException {

    public AccountStateException(String errorCode, String message) {
        super(
                HttpStatus.FORBIDDEN,
                errorCode,
                message
        );
    }
}
