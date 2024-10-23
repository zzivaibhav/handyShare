package com.g02.handyShare.User.DTO;

import jakarta.annotation.sql.DataSourceDefinition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class PasswordChangeRequest {
    private String currentPassword;
    private String newPassword;
  
}
