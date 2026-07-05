package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface VisitService {

    VisitResponseDto create(Authentication authentication,
                            CreateVisitRequestDto dto);

    List<VisitResponseDto> getAll(Authentication authentication);

    VisitResponseDto getById(Authentication authentication,
                             String id);

    VisitResponseDto update(Authentication authentication,
                            String id,
                            UpdateVisitRequestDto dto);

    void delete(Authentication authentication,
                String id);
}