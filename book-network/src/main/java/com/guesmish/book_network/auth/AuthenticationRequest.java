package com.guesmish.book_network.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

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

