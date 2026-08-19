package com.techmind.backend.service;

import com.techmind.backend.dto.ContenidoRequestDTO;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaCoreProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class DocumentExtractionService {

    private final Tika tika = new Tika();

    public ContenidoRequestDTO extractContent(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        Metadata metadata = new Metadata();
        String text;
        
        try (InputStream inputStream = file.getInputStream()) {
            text = tika.parseToString(inputStream, metadata);
        }

        String cleanedText = cleanText(text);
        String title = inferTitle(metadata, originalFilename);

        return new ContenidoRequestDTO(title, cleanedText);
    }

    private String cleanText(String text) {
        if (text == null) return "";
        // Reemplaza múltiples espacios en blanco, tabs y saltos de línea por un espacio único
        return text.replaceAll("[\\s\\t\\n\\r]+", " ").trim();
    }

    private String inferTitle(Metadata metadata, String filename) {
        String title = metadata.get(TikaCoreProperties.TITLE);
        if (title != null && !title.isBlank()) {
            return title.trim();
        }
        if (filename != null) {
            // Remueve extensión y reemplaza guiones bajos/medios por espacios
            return filename.replaceAll("\\.[^.]+$", "").replaceAll("[_\\-]+", " ").trim();
        }
        return "Documento sin título";
    }
}
