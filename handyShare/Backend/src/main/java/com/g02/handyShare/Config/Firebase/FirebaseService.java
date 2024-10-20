package com.g02.handyShare.Config.Firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.Objects;

import static org.aspectj.weaver.tools.cache.SimpleCacheFactory.path;

@Service
public class FirebaseService {
    public ResponseEntity<String> uploadFile(MultipartFile multipartFile, String path) throws IOException {
        String objectName = generateFileName(multipartFile);

        // Load the Firebase service account key from the classpath
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
        if (serviceAccount == null) {
            throw new IOException("Firebase service account file not found in resources folder");
        }

        File file = convertMultiPartToFile(multipartFile);
        Path filePath = file.toPath();

        // Initialize the Firebase Storage
        Storage storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setProjectId("handyshare-b3506")
                .build()
                .getService();

        // Create a BlobId with the specified folder path
        BlobId blobId = BlobId.of("handyshare-b3506.appspot.com", path + "/" + objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(multipartFile.getContentType()).build();

        storage.create(blobInfo, Files.readAllBytes(filePath));

        // Optionally, delete the temporary file after upload
        file.delete();

        return ResponseEntity.status(HttpStatus.CREATED).body("File uploaded successfully to path: " + path);
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        }
        return convertedFile;
    }

    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + Objects.requireNonNull(multiPart.getOriginalFilename()).replace(" ", "_");
    }


    // Retrieve the file from storage

    public ResponseEntity<byte[]> downloadFile(String path) throws IOException {
        // Load the Firebase service account key from the classpath
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
        if (serviceAccount == null) {
            throw new IOException("Firebase service account file not found in resources folder");
        }

        // Initialize the Firebase Storage
        Storage storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setProjectId("handyshare-b3506")
                .build()
                .getService();

        // Retrieve the file from storage
        Blob blob = storage.get("handyshare-b3506.appspot.com", path);
        if (blob == null || !blob.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Read the file into a byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blob.downloadTo(outputStream);
        byte[] fileBytes = outputStream.toByteArray();

        // Set the content type based on the file type
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, blob.getContentType());
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path + "\"");

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileBytes);
    }

}

