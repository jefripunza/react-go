package auth

import (
	"fmt"
	"strings"
	"time"

	"react-go/core/dto"
	"react-go/core/environment"
	"react-go/core/function"
	"react-go/core/function/hash"
	role "react-go/core/modules/role/model"
	model "react-go/core/modules/user/model"
	"react-go/core/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID string, role string) (string, error) {
	claims := jwt.MapClaims{
		"id":   userID,
		"role": role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
		"iat":  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(environment.GetJWTSecret())
}

func ParseToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return environment.GetJWTSecret(), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}

func getUserMapWithRoles(user model.User) map[string]any {
	var roleUsers []role.RoleUser
	variable.Db.Where("user_id = ?", user.ID).Find(&roleUsers)
	var roleIds []uint
	for _, ru := range roleUsers {
		roleIds = append(roleIds, ru.RoleID)
	}
	var roles []role.Role
	if len(roleIds) > 0 {
		variable.Db.Where("id IN ?", roleIds).Find(&roles)
	}

	userMap := user.Map()
	userRoles := make([]map[string]any, 0)
	for _, r := range roles {
		userRoles = append(userRoles, map[string]any{
			"division_id": fmt.Sprintf("%v", r.RoleDivisionID),
			"role_id":     fmt.Sprintf("%v", r.ID),
			"role_name":   r.Name,
		})
	}
	userMap["roles"] = userRoles
	return userMap
}

func Login(c *fiber.Ctx) error {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := function.RequestBody(c, &body); err != nil {
		return dto.BadRequest(c, err.Error(), nil)
	}

	if body.Username == "" {
		return dto.BadRequest(c, "Username is required", nil)
	}
	if body.Password == "" {
		return dto.BadRequest(c, "Password is required", nil)
	}

	// Find user by username
	var user model.User
	if err := variable.Db.
		Where("username = ?", body.Username).
		First(&user).
		Error; err != nil {
		return dto.Unauthorized(c, "Invalid username or password", nil)
	}

	// Verify password
	if !hash.ValidatePassword(body.Password, user.Password) {
		return dto.Unauthorized(c, "Invalid username or password", nil)
	}

	token, err := GenerateToken(user.ID.String(), user.Role)
	if err != nil {
		return dto.InternalServerError(c, "Failed to generate token", nil)
	}

	return dto.OK(c, "Login success", fiber.Map{
		"token": token,
		"user":  getUserMapWithRoles(user),
	})
}

func Logout(c *fiber.Ctx) error {
	// logic revoke
	return dto.OK(c, "Logout success", nil)
}

func Validate(c *fiber.Ctx) error {
	user, err := function.JwtGetUser(c)
	if err != nil {
		message := err.Error()
		if strings.Contains(message, "user not found") {
			return dto.Unauthorized(c, "user not found", nil)
		}
		return dto.InternalServerError(c, message, nil)
	}

	return dto.OK(c, "Token valid", fiber.Map{
		"user": getUserMapWithRoles(user),
	})
}
