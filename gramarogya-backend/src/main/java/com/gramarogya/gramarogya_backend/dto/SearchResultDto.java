package com.gramarogya.gramarogya_backend.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SearchResultDto {

    private String id;

    private String title;

    private String subtitle;

    private String type;

    private String route;

}
