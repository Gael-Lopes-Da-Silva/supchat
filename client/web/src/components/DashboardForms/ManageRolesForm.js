import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import Button from "../Button/Button";
import { readWorkspaceMember } from "../../services/WorkspaceMembers";
import { getRoles } from "../../services/Roles";
import { updateWorkspaceMember } from "../../services/WorkspaceMembers";


const ManageRolesForm = ({ theme, workspaceId, onClose }) => {
    const [members, setMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await readWorkspaceMember({ workspace_id: workspaceId });
            const roleRes = await getRoles();

            if (res?.result) setMembers(res.result);
            if (roleRes?.result) setRoles(roleRes.result);
            setLoading(false);
        };

        fetchData();
    }, [workspaceId]);

    const handleRoleChange = async (memberId, newRoleId) => {
        const member = members.find(m => m.id === memberId);

        await updateWorkspaceMember(memberId, {
            role_id: parseInt(newRoleId),
            workspace_id: member.workspace_id,
            user_id: member.user_id,
        });

        setMembers((prev) =>
            prev.map((m) =>
                m.id === memberId ? { ...m, role_id: parseInt(newRoleId) } : m
            )
        );
    };


    if (loading) return <p>Chargement...</p>;

    return (
        <form className={`manage-roles-form ${theme}`}>
            <h3>Gérer les rôles du workspace</h3>
            {members.map((member) => (
                <div key={member.id} style={{ marginBottom: "1rem" }}>
                    <label>
                        <strong>{member.username}</strong>
                    </label>
                    <Select
                        theme={theme}
                        value={member.role_id}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        options={roles.map((r) => ({ label: r.name, value: r.id }))}
                    />
                </div>
            ))}

            <Button
                type="button"
                text="Fermer"
                theme={theme}
                onClick={onClose}
            />
        </form>
    );
};

export default ManageRolesForm;
