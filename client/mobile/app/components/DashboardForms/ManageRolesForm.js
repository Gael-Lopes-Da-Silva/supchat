import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { readWorkspaceMember, updateWorkspaceMember } from '../../../services/WorkspaceMembers';
import { getRoles } from '../../../services/Roles';

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
    const member = members.find((m) => m.id === memberId);
    await updateWorkspaceMember(memberId, {
      role_id: parseInt(newRoleId),
      workspace_id: member.workspace_id,
      user_id: member.user_id,
    });
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role_id: parseInt(newRoleId) } : m))
    );
  };

  if (loading) return <Text>Chargement...</Text>;

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Gérer les rôles du workspace</Text>
      {members.map((member) => (
        <View key={member.id} style={{ marginBottom: 16 }}>
          <Text>{member.username}</Text>
          <Select
            theme={theme}
            value={member.role_id}
            onChange={(value) => handleRoleChange(member.id, value)}
            options={roles.map((r) => ({ label: r.name, value: r.id }))}
          />
        </View>
      ))}
      <Button type="button" text="Fermer" theme={theme} onClick={onClose} />
    </View>
  );
};

export default ManageRolesForm;