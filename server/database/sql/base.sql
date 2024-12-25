-- DATABASE
CREATE DATABASE supchat;
CREATE USER 'supchat'@'%' IDENTIFIED BY 'supchat';
GRANT ALL PRIVILEGES ON supchat.* TO 'supchat'@'%';
FLUSH PRIVILEGES;
USE supchat;

-- STATUS
CREATE TABLE status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO status (name)
VALUES
    ('offline'),
    ('online'),
    ('inactive'),
    ('do_not_disturb'),
    ('mobile_offline'),
    ('mobile_online'),
    ('mobile_inactive'),
    ('mobile_do_not_disturb');

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    status_id INT NOT NULL,
    link_google TINYINT(1) DEFAULT 0,
    link_facebook TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (status_id) REFERENCES status(id)
);

-- WORKSPACES
CREATE TABLE workspaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_private TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- WORKSPACE INVITATIONS
CREATE TABLE workspace_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    maximum_use INT DEFAULT NULL,
    used_by INT DEFAULT 0,
    expire_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

-- CHANNELS
CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_private TINYINT(1) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- MESSAGES
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- FILES
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT,
    file BLOB NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id)
);

-- REACTIONS
CREATE TABLE reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    emoji VARCHAR(20) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP NULL,
    UNIQUE (message_id, user_id, emoji),
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- PERMISSIONS
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO permissions (name)
VALUES
    ('can_assign_roles'),
    ('can_set_permissions'),
    ('can_post'),
    ('can_moderate'),
    ('can_manage_members');

-- WORKSPACE PERMISSIONS
CREATE TABLE workspace_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    workspace_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE (workspace_id, user_id, permission_id)
);

-- CHANNEL PERMISSIONS
CREATE TABLE channel_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    channel_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE (channel_id, user_id, permission_id)
);

-- ROLES
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name)
VALUES
    ('admin'),
    ('member'),
    ('guest');

-- WORKSPACE MEMBERSHIPS
CREATE TABLE workspace_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    UNIQUE (workspace_id, user_id),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- CHANNEL MEMBERSHIPS
CREATE TABLE channel_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id INT NOT NULL,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    UNIQUE (channel_id, user_id),
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ROLES PERMISSIONS
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id AS role_id, p.id AS permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id AS role_id, p.id AS permission_id
FROM roles r
JOIN permissions p
ON p.name IN ('can_post', 'can_moderate')
WHERE r.name = 'member';

-- TRIGGERS
DELIMITER $$

CREATE TRIGGER add_workspace_creator_as_admin
AFTER INSERT ON workspaces
FOR EACH ROW
BEGIN
    INSERT INTO workspace_members (workspace_id, user_id, role_id, added_at)
    VALUES (NEW.id, NEW.user_id, 'admin', NOW());
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER add_channel_creator_as_admin
AFTER INSERT ON channels
FOR EACH ROW
BEGIN
    INSERT INTO channel_members (channel_id, user_id, role_id, added_at)
    VALUES (NEW.id, NEW.user_id, 'admin', NOW());
END$$

DELIMITER ;