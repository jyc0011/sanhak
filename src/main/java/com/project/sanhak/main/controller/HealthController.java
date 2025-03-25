package com.project.sanhak.main.controller;

import com.project.sanhak.card.dto.aiCardDTO;
import com.project.sanhak.domain.user.OAuthToken;
import com.project.sanhak.domain.user.User;
import com.project.sanhak.main.dto.cardDTO;
import com.project.sanhak.main.dto.profileDTO;
import com.project.sanhak.main.dto.rankDTO;
import com.project.sanhak.main.repository.OAuthTokenRepository;
import com.project.sanhak.main.repository.UserRepository;
import com.project.sanhak.main.service.MainService;
import com.project.sanhak.main.service.ProfileService;
import com.project.sanhak.util.s3.S3FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "${cors.allowed.origin}")
public class HealthController {
    @Operation(summary = "cicd 확인", description = "cicd가 정상적으로 작동하고 있는지 확인하는 메서드입니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "COMMON_200", description = "Success"),
    })
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
}
