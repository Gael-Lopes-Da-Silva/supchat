export const ERRORS = {
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
    NAME_NOT_PROVIDED: { code: 15, message: "Name not provided" },
    DESCRIPTION_NOT_PROVIDED: { code: 16, message: "Description not provided" },
    IS_PRIVATE_NOT_PROVIDED: { code: 17, message: "Is_private not provided" },
    USER_ID_NOT_PROVIDED: { code: 18, message: "User_id not provided" },
    WORKSPACE_NOT_FOUND: { code: 20, message: "Workspace not found" },
    WORKSPACE_DELETED: { code: 21, message: "Workspace deleted" },
    ID_NOT_PROVIDED: { code: 22, message: "Id not provided" },
    WORKSPACE_ALREADY_DELETED: { code: 23, message: "Workspace already deleted" },
    WORKSPACE_NOT_DELETED: { code: 24, message: "Workspace not deleted" },
    WORKSPACE_ID_NOT_PROVIDED: { code: 25, message: "Workspace_id not provided" },
    PERMISSION_ID_NOT_PROVIDED: { code: 26, message: "Permission_id not provided" },
    PERMISSION_NOT_FOUND: { code: 27, message: "Permission not found" },
    WORKSPACE_PERMISSION_NOT_FOUND: { code: 28, message: "Workspace permission not found" },
    ROLE_ID_NOT_PROVIDED: { code: 29, message: "Role_id not provided" },
    ROLE_NOT_FOUND: { code: 30, message: "Role not found" },
    USER_ALREADY_EXISTS_IN_WORKSPACE: { code: 31, message: "User already exists in this workspace" },
    WORKSPACE_MEMBER_NOT_FOUND: { code: 32, message: "Workspace member not found" },
    WORKSPACE_MEMBER_DELETED: { code: 33, message: "Workspace member deleted" },
    WORKSPACE_MEMBER_ALREADY_DELETED: { code: 34, message: "Workspace member already deleted" },
    WORKSPACE_MEMBER_NOT_DELETED: { code: 35, message: "Workspace member not deleted" },
    WORKSPACE_INVITATION_NOT_FOUND: { code: 39, message: "Workspace invitation not found" },
    WORKSPACE_INVITATION_DELETED: { code: 40, message: "Workspace invitation deleted" },
    WORKSPACE_INVITATION_ALREADY_DELETED: { code: 41, message: "Workspace invitation already deleted" },
    WORKSPACE_INVITATION_NOT_DELETED: { code: 42, message: "Workspace invitation not deleted" },
    CHANNEL_NOT_FOUND: { code: 43, message: "Channel not found" },
    CHANNEL_DELETED: { code: 44, message: "Channel deleted" },
    CHANNEL_ALREADY_DELETED: { code: 45, message: "Channel already deleted" },
    CHANNEL_NOT_DELETED: { code: 46, message: "Channel not deleted" },
    CHANNEL_ID_NOT_PROVIDED: { code: 47, message: "Channel_id not provided" },
    CHANNEL_PERMISSION_NOT_FOUND: { code: 48, message: "Channel permission not found" },
    USER_ALREADY_EXIST_IN_CHANNEL: { code: 49, message: "User already exist in this channel" },
    CHANNEL_MEMBER_NOT_FOUND: { code: 50, message: "Channel member not found" },
    CHANNEL_MEMBER_DELETED: { code: 51, message: "Channel member deleted" },
    CHANNEL_MEMBER_ALREADY_DELETED: { code: 52, message: "Channel member already deleted" },
    CHANNEL_MEMBER_NOT_DELETED: { code: 53, message: "Channel member not deleted" },
    USER_NOT_CONFIRMED: { code: 54, message: "User not confirmed" },
};

export const createErrorResponse = (error) => ({
    error: error.code,
    error_message: error.message,
});