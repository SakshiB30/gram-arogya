package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.VisitMapper;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitServiceImpl implements VisitService {

    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final VisitMapper visitMapper;

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public VisitResponseDto create(Authentication authentication,
                                   CreateVisitRequestDto dto) {

        User currentUser = getCurrentUser(authentication);

        Visit visit = visitMapper.toEntity(dto);

        visit.setUserId(currentUser.getId());
        visit.setVisitDate(LocalDate.now());

        visitRepository.save(visit);

        return visitMapper.toResponseDto(visit);
    }

    @Override
    public List<VisitResponseDto> getAll(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        return visitRepository.findByUserId(currentUser.getId())
                .stream()
                .map(visitMapper::toResponseDto)
                .toList();
    }

    @Override
    public VisitResponseDto getById(Authentication authentication,
                                    String id) {

        User currentUser = getCurrentUser(authentication);

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return visitMapper.toResponseDto(visit);
    }

    @Override
    public VisitResponseDto update(Authentication authentication,
                                   String id,
                                   UpdateVisitRequestDto dto) {

        User currentUser = getCurrentUser(authentication);

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        visitMapper.updateEntity(dto, visit);

        visitRepository.save(visit);

        return visitMapper.toResponseDto(visit);
    }

    @Override
    public void delete(Authentication authentication,
                       String id) {

        User currentUser = getCurrentUser(authentication);

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        visitRepository.delete(visit);
    }
}