import express from "express";
import {
    readWorkspaces,
    createWorkspaces,
    updateWorkspaces,
    deleteWorkspaces,
    createWorkspacesMember,
    readWorkspacesUser,
} from "../controllers/workspacesController.js";

const router = express.Router();

router.get("/read", (request, response) => {
    readWorkspaces().then(([rows]) => {
        response.status(200).json({
            when: "Reading workspaces",
            error: 0,
            data: rows,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Reading workspaces",
            error: 1,
            error_message: error.message,
        });
    });
});

router.post("/create", (request, response) => {
    createWorkspaces(request).then(() => {
        response.status(201).json({
            when: "Creating workspaces",
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Creating workspaces",
            error: 1,
            error_message: error.message,
        });
    });
});

router.put("/update", (request, response) => {
    updateWorkspaces(request).then((result) => {
        if (result[0].affectedRows === 0) {
            response.status(404).json({
                when: "Updating workspaces",
                error: 1,
                error_message: "Workspace non trouvée ou déjà supprimée.",
            });
        } else {
            response.status(200).json({
                when: "Updating workspaces",
                error: 0,
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Updating workspaces",
            error: 1,
            error_message: error.message,
        });
    });
});

router.delete("/delete", (request, response) => {
    deleteWorkspaces(request).then((result) => {
        if (result[0].affectedRows === 0) {
            response.status(404).json({
                when: "Deleting workspaces",
                error: 1,
                error_message: "Workspace non trouvée ou déjà supprimée.",
            });
        } else {
            response.status(200).json({
                when: "Deleting workspaces",
                error: 0,
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Deleting workspaces",
            error: 1,
            error_message: error.message,
        });
    });
});

router.get("/readForUser", (request, response) => {
    readWorkspacesUser().then(([rows]) => {
        response.status(200).json({
            when: "Reading workspaces for user",
            error: 0,
            data: rows,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Reading workspaces for user",
            error: 1,
            error_message: error.message,
        });
    });
});

router.post("/createMember", (request, response) => {
    createWorkspacesMember(request).then(() => {
        response.status(201).json({
            when: "Creating workspaces member",
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Creating workspaces member",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;
