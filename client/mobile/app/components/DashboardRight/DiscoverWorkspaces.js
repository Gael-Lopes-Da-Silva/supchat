import { View, Text, Button, ScrollView } from 'react-native';

const DiscoverWorkspaces = ({
  publicWorkspaces,
  workspaces,
  onJoinWorkspace,
  onClose,
  toggleLeftPanel,
}) => {
  const filteredWorkspaces = publicWorkspaces.filter(ws => !workspaces[ws.id]);

  return (
    <ScrollView>
      <View>
        <Button title="Afficher/Masquer le panneau de gauche" onPress={toggleLeftPanel} />
        <Text>Découvrir de nouveaux espaces de travail</Text>
        <Button title="Fermer" onPress={onClose} />
        {filteredWorkspaces.length === 0 ? (
          <Text>Aucun espace de travail public disponible.</Text>
        ) : (
          filteredWorkspaces.map(ws => (
            <View key={ws.id} style={{ marginVertical: 10 }}>
              <Text>{ws.name}</Text>
              <Text>{ws.description}</Text>
              <Button title="Rejoindre" onPress={() => onJoinWorkspace(ws)} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default DiscoverWorkspaces;