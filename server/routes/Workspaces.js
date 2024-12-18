import express from "express";

import {
    createWorkspace,
    addWorkspaceMember,
    getWorkspaceById,
    getAllWorkspaces,
    getWorkspaceMemberById,
    getWorkspaceMemberByUserIdAndWorkspaceId,
    getAllWorkspaceMembersByUserId,
    getAllWorkspaceMembersByWorkspaceId,
    updateWorkspace,
    updateWorkspaceMember,
    deleteWorkspace,
    deleteWorkspaceMember
} from "../controllers/Workspaces.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// body:
//   name: string
//   description: string
//   is_private: boolean
//   user_id: integer
// return:
//   ...
router.post("/create", (request, response) => {
    createWorkspace(request).then((result) => {
        if (result !== null) {
            response.status(201).json({
                when: "Workspaces > Create",
                error: 0,
            });
        } else {
            response.status(500).json({
                when: "Workspaces > Create",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(404).json({
            when: "Workspaces > Create",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   workspace_id: integer
//   user_id: integer
// return:
//   ...
router.post("/addMember", (request, response) => {
    addWorkspaceMember(request).then((result) => {
        if (result !== "") {
            response.status(201).json({
                when: "Workspaces > AddMember",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > AddMember",
                error: 1,
                error_message: "User or workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > AddMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// body:
//   id: integer
// return:
//   result: [workspace]
router.get("/getById", (request, response) => {
    getWorkspaceById().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > GetById",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > GetById",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > GetById",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   ...
// return:
//   result: [workspace]
router.get("/getAll", (request, response) => {
    getAllWorkspaces().then((result) => {
        response.status(200).json({
            when: "Workspaces > GetAll",
            result: result,
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > GetAll",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
// return:
//   result: [workspace_member]
router.get("/getMemberById", (request, response) => {
    getWorkspaceMemberById().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > GetMemberById",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > GetMemberById",
                error: 1,
                error_message: "Workspace member not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > GetMemberById",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   user_id: integer
//   workspace_id: integer
// return:
//   result: [workspace_member]
router.get("/getMemberByUserIdAndWorkspaceId", (request, response) => {
    getWorkspaceMemberByUserIdAndWorkspaceId().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > GetMemberByUserIdAndWorkspaceId",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > GetMemberByUserIdAndWorkspaceId",
                error: 1,
                error_message: "User or workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > GetMemberByUserIdAndWorkspaceId",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   user_id: integer
// return:
//   result: [workspace_member]
router.get("/getAllMembersByUserId", (request, response) => {
    getAllWorkspaceMembersByUserId().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > GetAllWorkspaceMembersByUserId",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > GetAllWorkspaceMembersByUserId",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > GetAllWorkspaceMembersByUserId",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   workspace_id: integer
// return:
//   result: [workspace_member]
router.get("/getAllMembersByWorkspaceId", (request, response) => {
    getAllWorkspaceMembersByWorkspaceId().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > GetAllWorkspaceMembersByWorkspaceId",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > GetAllWorkspaceMembersByWorkspaceId",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > GetAllWorkspaceMembersByWorkspaceId",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// body:
//   id: integer
//   name: string
//   description: string
//   is_private: boolean
//   user_id: integer
// return:
//   ...
router.put("/update", (request, response) => {
    updateWorkspace(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > Update",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > Update",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > Update",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
//   user_id: integer
//   workspace_id: integer
//   role: string
// return:
//   ...
router.put("/updateMember", (request, response) => {
    updateWorkspace(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > UpdateMember",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > UpdateMember",
                error: 1,
                error_message: "Workspace member not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > UpdateMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Delete
// --------------------

// body:
//   id: integer
// return:
//   ...
router.delete("/delete", (request, response) => {
    deleteWorkspace(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > Delete",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > Delete",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > Delete",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
// return:
//   ...
router.delete("/deleteMember", (request, response) => {
    deleteWorkspaceMember(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > DeleteMember",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > DeleteMember",
                error: 1,
                error_message: "Workspace member not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > DeleteMember",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;
