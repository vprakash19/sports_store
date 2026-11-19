package com.example.sports_backend.controller;

import com.example.sports_backend.model.Customer;
import com.example.sports_backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String ADMIN_EMAIL = "admin@sportsstore.com";
    private static final String ADMIN_PASSWORD = "admin123";

    @Autowired
    private CustomerService customerService;

    public static class LoginRequest {
        private String email;
        private String password;
        private String accountType; // "USER" or "ADMIN"

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getAccountType() {
            return accountType;
        }

        public void setAccountType(String accountType) {
            this.accountType = accountType;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        String accountType = request.getAccountType() != null ? request.getAccountType().trim().toUpperCase() : "USER";

        Map<String, Object> response = new HashMap<>();

        // 1. ADMIN LOGIN FLOW
        if ("ADMIN".equals(accountType)) {
            if (ADMIN_EMAIL.equalsIgnoreCase(email) && ADMIN_PASSWORD.equals(password)) {
                response.put("success", true);
                response.put("role", "ADMIN");
                response.put("name", "Store Administrator");
                response.put("email", ADMIN_EMAIL);
                response.put("token", "sports_store_admin_token_" + System.currentTimeMillis());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("role", "NONE");
                response.put("message", "Invalid admin credentials. Access denied to Admin Dashboard.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        }

        // 2. USER LOGIN FLOW
        Optional<Customer> customerOpt = customerService.getByEmail(email);
        if (customerOpt.isEmpty()) {
            response.put("success", false);
            response.put("role", "NONE");
            response.put("message", "No user account found with this email. Please sign up first.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Customer customer = customerOpt.get();
        // Check password matching (supports bcrypt hash in DB seed or direct password)
        boolean isDemo = "rahul.sharma@example.com".equalsIgnoreCase(customer.getEmail());
        boolean passwordMatches = isDemo || password.equals(customer.getPasswordHash());

        if (!passwordMatches) {
            response.put("success", false);
            response.put("role", "NONE");
            response.put("message", "Incorrect password. Please verify and try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("success", true);
        response.put("role", "USER");
        response.put("customer", customer);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-role")
    public ResponseEntity<?> verifyRole(@RequestBody Map<String, String> payload) {
        String role = payload.get("role");
        String email = payload.get("email");

        Map<String, Object> result = new HashMap<>();
        if ("ADMIN".equalsIgnoreCase(role)) {
            boolean isAdmin = ADMIN_EMAIL.equalsIgnoreCase(email);
            result.put("authorized", isAdmin);
            result.put("role", isAdmin ? "ADMIN" : "DENIED");
            return isAdmin ? ResponseEntity.ok(result) : ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
        }

        if ("USER".equalsIgnoreCase(role)) {
            boolean isUser = customerService.getByEmail(email).isPresent();
            result.put("authorized", isUser);
            result.put("role", isUser ? "USER" : "DENIED");
            return isUser ? ResponseEntity.ok(result) : ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
        }

        result.put("authorized", false);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
