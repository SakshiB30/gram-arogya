package com.gramarogya.gramarogya_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequestDto {

    @NotBlank(message = "Reset token is required.")
    private String resetToken;

    @NotBlank(message = "New password is required.")
    private String newPassword;
}
