using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Core;
using OpenIddict.EntityFrameworkCore.Models;
using SmartLoad.Auth.Entities;
using System.Security.Claims;

namespace SmartLoad.Auth.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly OpenIddictApplicationManager<OpenIddictEntityFrameworkCoreApplication> _applicationManager;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        OpenIddictApplicationManager<OpenIddictEntityFrameworkCoreApplication> applicationManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _applicationManager = applicationManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        await _userManager.AddToRoleAsync(user, "User");
        await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"));
        await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Email, user.Email));

        return Ok(new { message = "User registered successfully", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null || !user.IsActive)
        {
            return Unauthorized(new { error = "invalid_grant", error_description = "Invalid credentials" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded)
        {
            return Unauthorized(new { error = "invalid_grant", error_description = "Invalid credentials" });
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        // Generate tokens manually using OpenIddict
        var tokens = await GenerateTokensAsync(user);
        
        return Ok(tokens);
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin([FromQuery] string? returnUrl = null)
    {
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(
            GoogleDefaults.AuthenticationScheme,
            "/api/account/google-callback",
            new AuthenticationProperties { RedirectUri = returnUrl ?? "/api/account/google-callback" });

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
        if (externalLoginInfo == null)
        {
            return BadRequest(new { error = "external_login_failed" });
        }

        var email = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { error = "email_not_provided" });
        }

        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null)
        {
            // Create new user
            var firstName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.GivenName) ?? "";
            var lastName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Surname) ?? "";

            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                FirstName = firstName,
                LastName = lastName,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            await _userManager.AddToRoleAsync(user, "User");
        }

        if (!user.IsActive)
        {
            return Unauthorized(new { error = "user_disabled" });
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        // Generate tokens
        var tokens = await GenerateTokensAsync(user);

        // Return tokens directly (for SPA)
        return Ok(tokens);
    }

    private async Task<TokenResponse> GenerateTokensAsync(ApplicationUser user)
    {
        var client = await _applicationManager.FindByClientIdAsync("smartload-frontend");
        
        var claims = new List<Claim>
        {
            new(OpenIddictConstants.Subjects.User, user.Id),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email ?? ""),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}".Trim()),
            new(ClaimTypes.GivenName, user.FirstName ?? ""),
            new(ClaimTypes.Surname, user.LastName ?? "")
        };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var identity = new ClaimsIdentity(claims, OpenIddictConstants.AuthenticationScheme.Bearer);

        var principal = new ClaimsPrincipal(identity);
        
        // Generate tokens using OpenIddict
        var accessToken = GenerateJwtToken(principal);
        
        // Generate refresh token
        var refreshToken = Guid.NewGuid().ToString("N");

        return new TokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            TokenType = "Bearer",
            ExpiresIn = 1800 // 30 minutes
        };
    }

    private string GenerateJwtToken(ClaimsPrincipal principal)
    {
        // For development - use a simple token generation
        // In production, use proper JWT signing
        var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        
        var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes("your-super-secret-key-that-is-at-least-32-characters-long"));
        
        var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(principal.Claims),
            Expires = DateTime.UtcNow.AddMinutes(30),
            Issuer = "SmartLoad.Auth",
            Audience = "SmartLoad.Api",
            SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
                key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

public record RegisterRequest(string Email, string Password, string? FirstName, string? LastName);
public record LoginRequest(string Email, string Password);
public record TokenResponse(string AccessToken, string RefreshToken, string TokenType, int ExpiresIn);
