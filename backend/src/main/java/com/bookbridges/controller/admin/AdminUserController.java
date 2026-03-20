package com.bookbridges.controller.admin;

import com.bookbridges.auth.UserDto;
import com.bookbridges.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDto>> listUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.adminListUsers(role, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.adminGetUserDetail(id));
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<UserDto> toggleSuspend(@PathVariable Long id) {
        return ResponseEntity.ok(userService.adminToggleSuspend(id));
    }

    @PostMapping("/{id}/strike")
    public ResponseEntity<UserDto> issueStrike(@PathVariable Long id) {
        return ResponseEntity.ok(userService.adminIssueStrike(id));
    }
}
