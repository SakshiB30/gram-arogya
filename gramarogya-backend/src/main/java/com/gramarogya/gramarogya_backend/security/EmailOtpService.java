package com.gramarogya.gramarogya_backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailOtpService {

    private final JavaMailSender mailSender;

    public void sendOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("ASHA - Password Reset OTP");

        message.setText(
                "Your password reset OTP is: " + otp
                        + "\n\n"
                        + "This OTP is valid for 10 minutes."
                        + "\n\n"
                        + "If you did not request a password reset, please ignore this email."
        );

        mailSender.send(message);
    }
}