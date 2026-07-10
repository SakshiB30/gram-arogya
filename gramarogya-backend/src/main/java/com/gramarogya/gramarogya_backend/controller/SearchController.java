package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.SearchResultDto;
import com.gramarogya.gramarogya_backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public List<SearchResultDto> search(
            @RequestParam String keyword,
            Authentication authentication){

        return searchService.search(authentication, keyword);
    }

}
