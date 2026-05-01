package com.bookbridges.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Cloudinary cloudinary;
    private final boolean useCloudinary;

    public FileStorageService(
            @Value("${app.upload-dir}") String uploadDir,
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {

        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }

        if (StringUtils.hasText(cloudName) && StringUtils.hasText(apiKey) && StringUtils.hasText(apiSecret)) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true));
            this.useCloudinary = true;
        } else {
            this.cloudinary = null;
            this.useCloudinary = false;
        }
    }

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot store empty file.");
        }

        if (useCloudinary) {
            try {
                // Upload to Cloudinary
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                return uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                throw new RuntimeException("Could not store file on Cloudinary. Please try again!", e);
            }
        } else {
            // Fallback to Local Storage
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            try {
                if (originalFileName.contains("..")) {
                    throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
                }

                String extension = "";
                int i = originalFileName.lastIndexOf('.');
                if (i > 0) {
                    extension = originalFileName.substring(i);
                }

                String newFileName = UUID.randomUUID().toString() + extension;
                Path targetLocation = this.fileStorageLocation.resolve(newFileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                return "/uploads/" + newFileName;
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
            }
        }
    }

    public java.util.List<String> storeFiles(MultipartFile[] files) {
        return java.util.Arrays.stream(files)
                .map(this::storeFile)
                .toList();
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }
}
