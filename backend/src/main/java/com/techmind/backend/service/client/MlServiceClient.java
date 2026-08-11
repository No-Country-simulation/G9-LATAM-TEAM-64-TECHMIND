package com.techmind.backend.service.client;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.MlResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MlServiceClient {

    private final WebClient webClient;

    public MlServiceClient(
            WebClient.Builder webClientBuilder,
            @Value("${ml.service.url}") String mlServiceUrl
    ) {
        this.webClient = webClientBuilder
                .baseUrl(mlServiceUrl)
                .build();
    }

    public MlResponseDTO processContent(ContenidoRequestDTO request) {
        return webClient.post()
                .uri("/predict")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(MlResponseDTO.class)
                .block(); // Blocking for simplicity in MVP
    }
}