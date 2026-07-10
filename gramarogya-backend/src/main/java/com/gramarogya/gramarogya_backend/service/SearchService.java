package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.SearchResultDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface SearchService {

    List<SearchResultDto> search(
            Authentication authentication,
            String keyword
    );
}