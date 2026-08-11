package com.techmind.backend.service.client;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.MlResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MlServiceClient {

    private final WebClient webClient;

    public MlServiceClient(WebClient.Builder webClientBuilder) {
        // Assuming FastAPI is running on port 8000
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
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
