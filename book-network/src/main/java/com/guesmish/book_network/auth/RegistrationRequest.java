package com.guesmish.book_network.auth;


import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@Builder

public class RegistrationRequest {

    @NotEmpty(message="Firstname is mandatory")
    @NotBlank(message="Firstname is mandatory")
    private String firstname;

    @NotEmpty(message="Lastname is mandatory")
    @NotBlank(message="Lastname is mandatory")
    private String lastname;

    @NotNull(message = "Date of Birth is mandatory")
    @Past(message = "Date of Birth must be in the past") // Ensures it's a valid date in the past
    @DateTimeFormat(pattern = "yyyy-MM-dd") // Optional: If the request accepts a specific format
    private LocalDate dateOfBirth;

    @Email(message="Email is not formatted")
    @NotEmpty(message="Email is mandatory")
    @NotBlank(message="Email is mandatory")
    private String email;

    @NotEmpty(message = "Password is mandatory")
    @NotBlank(message = "Password is mandatory")
    @Pattern(
            regexp = "^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one special character."
    )
    private String password;


}
