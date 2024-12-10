package com.guesmish.book_network.auth;

import com.guesmish.book_network.email.EmailService;
import com.guesmish.book_network.email.EmailTemplateName;
import com.guesmish.book_network.role.RoleRepository;
import com.guesmish.book_network.security.JwtService;
import com.guesmish.book_network.user.Token;
import com.guesmish.book_network.user.TokenRepository;
import com.guesmish.book_network.user.User;
import com.guesmish.book_network.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {


    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenrepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
    public void register(RegistrationRequest request) throws MessagingException {

        var userRole = roleRepository.findByName("USER")
                // todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("User Role Not Found"));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .dateOfBirth(request.getDateOfBirth())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();
        userRepository.save(user);
        sendValidatinEmail(user);
    }

    private void sendValidatinEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivatedToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"

        );
    }

    private String generateAndSaveActivatedToken(User user) {
        //generate a token
        String generatedToken = generateActivationToken(6);
        var token= Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenrepository.save(token);
        return generatedToken;
    }

    private String generateActivationToken(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomCharIndex = random.nextInt(characters.length());//0..9
            codeBuilder.append(characters.charAt(randomCharIndex));
        }
        return codeBuilder.toString();
    }



    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth=authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var claims= new HashMap<String, Object>();
        var user = ((User)auth.getPrincipal());
        claims.put("email", user.getEmail());
        claims.put("fullName", user.fullName());

            var jwtToken = jwtService.generateToken(claims,user);

            String message="Login Success";
        return  AuthenticationResponse.builder()
                    .token(jwtToken)
                    .message(message)
                    .build();

        }


    public void activateAccont(String token) throws MessagingException {
        Token savedToken = tokenrepository.findByToken(token)
                // todo  exception has to be defined
                .orElseThrow(() -> new RuntimeException("Invalid Token"));
        if(LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidatinEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired & a new token has been generated");
        }
        var user = userRepository.findByEmail(savedToken.getUser().getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid User"));
        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenrepository.save(savedToken);
    }
}





