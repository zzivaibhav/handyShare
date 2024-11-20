//package com.g02.handyShare.Config.Firebase;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.cloud.storage.*;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.ResponseEntity;
//import org.springframework.mock.web.MockMultipartFile;
//
//import java.io.ByteArrayInputStream;
//import java.io.ByteArrayOutputStream;
//import java.io.IOException;
//import java.nio.file.Path;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class FirebaseServiceTest {
//
//    private FirebaseService firebaseService;
//
//    @Mock
//    private Storage storage;
//
//    @Mock
//    private Blob blob;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        firebaseService = new FirebaseService();
//    }
//
//    @Test
//    void uploadFile_Success() throws IOException {
//        MockMultipartFile mockFile = new MockMultipartFile("file", "test.txt", "text/plain", "Sample Content".getBytes());
//        String path = "uploads";
//
//        // Mock the GoogleCredentials
//        GoogleCredentials mockCredentials = mock(GoogleCredentials.class);
//        BlobId mockBlobId = BlobId.of("handyshare-firebase.appspot.com", path + "/test.txt");
//        BlobInfo mockBlobInfo = BlobInfo.newBuilder(mockBlobId).build();
//
//        // Mock the storage interaction
//        when(storage.create(mockBlobInfo, mockFile.getBytes())).thenReturn(blob);
//
//        String result = firebaseService.uploadFile(mockFile, path);
//
//        assertTrue(result.contains("https://storage.googleapis.com/handyshare-firebase.appspot.com"));
//    }
//
//    @Test
//    void uploadFile_FileNotFound() throws IOException {
//        MockMultipartFile multipartFile = mock(MockMultipartFile.class);
//        when(multipartFile.getOriginalFilename()).thenReturn("test.txt");
//        when(multipartFile.getBytes()).thenReturn("Sample content".getBytes());
//
//        // Mock getResourceAsStream to return null (simulating file not found)
//        when(firebaseService.getClass().getClassLoader().getResourceAsStream("firebase-service-account.json")).thenReturn(null);
//
//        // Assert that an IOException is thrown
//        assertThrows(IOException.class, () -> firebaseService.uploadFile(multipartFile, "uploads"));
//    }
//
//
//    @Test
//    void downloadFile_Success() throws IOException {
//        String path = "uploads/test.txt";
//        String fileContent = "Sample file content";
//        byte[] fileBytes = fileContent.getBytes();
//
//        // Mock Blob
//        Blob blobMock = mock(Blob.class);
//
//        when(blobMock.exists()).thenReturn(true); // Blob exists
//        when(blobMock.getContentType()).thenReturn("text/plain"); // Set content type
//
//        // Mock downloadTo behavior
//        doAnswer(invocation -> {
//            ByteArrayOutputStream outputStream = invocation.getArgument(0);
//            outputStream.write(fileBytes);
//            return null;
//        }).when(blobMock).downloadTo(any(ByteArrayOutputStream.class));
//
//        // Mock Storage#get
//        when(storage.get("handyshare-firebase.appspot.com", path)).thenReturn(blobMock);
//
//        // Call the service
//        ResponseEntity<byte[]> response = firebaseService.downloadFile(path);
//
//        // Assertions
//        assertEquals(200, response.getStatusCodeValue());
//        assertArrayEquals(fileBytes, response.getBody());
//        assertEquals("text/plain", response.getHeaders().getContentType().toString());
//    }
//
//
//    @Test
//    void downloadFile_FileNotFound() throws IOException {
//        String path = "uploads/invalid.txt";
//
//        when(storage.get("handyshare-firebase.appspot.com", path)).thenReturn(null);
//
//        ResponseEntity<byte[]> response = firebaseService.downloadFile(path);
//
//        assertEquals(404, response.getStatusCodeValue());
//        assertNull(response.getBody());
//    }
//
//    @Test
//    void downloadFile_Exception() {
//        String path = "uploads/test.txt";
//
//        when(storage.get("handyshare-firebase.appspot.com", path)).thenThrow(new RuntimeException("Service unavailable"));
//
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> firebaseService.downloadFile(path));
//
//        assertEquals("Service unavailable", exception.getMessage());
//    }
//
//}