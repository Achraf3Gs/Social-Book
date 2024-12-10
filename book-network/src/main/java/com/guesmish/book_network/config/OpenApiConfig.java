package com.guesmish.book_network.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name= "Guesmish",
                        email= "guesmish-Contact@gmail.com",
                        url="https://guesmish.com/buiseness"
                ),
                description="OpenApi documentation for Spring security",
                title="OpenApi specification-Guesmish",
                version = "3.0.0",  // This should be a valid OpenAPI version,
                license = @License(
                        name="License name",
                        url="http://some-url.com"
                ),
                termsOfService = "Terms of service"
        ),
        servers = {
                @Server(
                        description = "local ENV",
                        url = "http://localhost:8080/api/v1"
                ),
                @Server(
                        description = "PROD ENV",
                        url = "https://guesmish.com/biseness"
                ),
        },
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )

        }
)
@SecurityScheme(
        name="bearerAuth",
        description="JWT auth description",
        scheme="bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in= SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
