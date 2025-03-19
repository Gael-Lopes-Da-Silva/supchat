export const ERRORS = {
    // Utilisateur
    USERNAME_NOT_PROVIDED: { code: 1, message: "Username not provided" },
    EMAIL_NOT_PROVIDED: { code: 2, message: "Email not provided" },
    PASSWORD_NOT_PROVIDED: { code: 3, message: "Password not provided" },
    USERNAME_ALREADY_USED: { code: 4, message: "Username already used" },
    EMAIL_ALREADY_USED: { code: 5, message: "Email already used" },
    USER_NOT_FOUND: { code: 9, message: "User not found" },
    WRONG_PASSWORD: { code: 10, message: "Wrong password" },
    USER_DELETED: { code: 12, message: "User deleted" },
    USER_ALREADY_DELETED: { code: 13, message: "User already deleted" },
    USER_NOT_DELETED: { code: 14, message: "User not deleted" },
    USER_NOT_CONFIRMED: { code: 54, message: "User not confirmed" },

    // Authentification & Sécurité
    INVALID_TOKEN: { code: 55, message: "Invalid token" },
    EXPIRED_TOKEN: { code: 56, message: "Token expired" },
    ACCESS_DENIED: { code: 57, message: "Access denied" },
    UNAUTHORIZED_ACTION: { code: 58, message: "Unauthorized action" },
    ACCOUNT_SUSPENDED: { code: 59, message: "Account suspended" },
    TOO_MANY_ATTEMPTS: { code: 60, message: "Too many login attempts, please try again later" },
    INVALID_CREDENTIALS: { code: 61, message: "Invalid credentials" },

    // Lien & Connexion des comptes (oAuth)
    SOCIAL_ACCOUNT_ALREADY_LINKED: { code: 62, message: "This social account is already linked to another user" },
    SOCIAL_ACCOUNT_NOT_FOUND: { code: 63, message: "No linked social account found" },
    LINK_FAILED: { code: 64, message: "Failed to link social account" },
    UNLINK_FAILED: { code: 65, message: "Failed to unlink social account" },

    // Données & Validation
    INVALID_EMAIL_FORMAT: { code: 66, message: "Invalid email format" },
    PASSWORD_TOO_WEAK: { code: 67, message: "Password too weak" },
    DATA_MISSING: { code: 68, message: "Missing required data" },
    DATA_CONFLICT: { code: 69, message: "Data conflict error" },
    INVALID_INPUT: { code: 70, message: "Invalid input provided" },

    // Ressources & Gestion des accès
    RESOURCE_NOT_FOUND: { code: 71, message: "Requested resource not found" },
    PERMISSION_DENIED: { code: 72, message: "Permission denied" },
    OPERATION_FAILED: { code: 73, message: "Operation failed, please try again" },

    // Serveur & Base de données
    INTERNAL_SERVER_ERROR: { code: 74, message: "Internal server error" },
    DATABASE_ERROR: { code: 75, message: "Database error" },
    SERVICE_UNAVAILABLE: { code: 76, message: "Service temporarily unavailable" },

    // Workspaces
    WORKSPACE_NOT_FOUND: { code: 20, message: "Workspace not found" },
    WORKSPACE_DELETED: { code: 21, message: "Workspace deleted" },
    WORKSPACE_ALREADY_DELETED: { code: 23, message: "Workspace already deleted" },
    WORKSPACE_NOT_DELETED: { code: 24, message: "Workspace not deleted" },
    WORKSPACE_ID_NOT_PROVIDED: { code: 25, message: "Workspace_id not provided" },

    //Channels
    CHANNEL_NOT_FOUND: { code: 43, message: "Channel not found" },
    CHANNEL_DELETED: { code: 44, message: "Channel deleted" },
    CHANNEL_ALREADY_DELETED: { code: 45, message: "Channel already deleted" },
    CHANNEL_NOT_DELETED: { code: 46, message: "Channel not deleted" },
    CHANNEL_ID_NOT_PROVIDED: { code: 47, message: "Channel_id not provided" },

    // Rôles & Permissions
    ROLE_ID_NOT_PROVIDED: { code: 29, message: "Role_id not provided" },
    ROLE_NOT_FOUND: { code: 30, message: "Role not found" },
    PERMISSION_ID_NOT_PROVIDED: { code: 26, message: "Permission_id not provided" },
    PERMISSION_NOT_FOUND: { code: 27, message: "Permission not found" },
    PERMISSION_DENIED: { code: 72, message: "Permission denied" },
};

export const createErrorResponse = (error, additionalMessage = "") => ({
    error: error.code,
    error_message: additionalMessage ? `${error.message} - ${additionalMessage}` : error.message,
});
