package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnmDashboardDto {

    private long totalAshas;

    private long pendingAshas;

    private long approvedAshas;

    private long rejectedAshas;
}
