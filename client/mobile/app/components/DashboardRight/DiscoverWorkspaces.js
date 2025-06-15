import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Reanimated from 'react-native-reanimated';
import styles from './DashboardRightStyle';


const DiscoverWorkspaces = ({
  publicWorkspaces,
  workspaces,
  onJoinWorkspace,
  onClose,
  toggleLeftPanel,
}) => {
  const filteredWorkspaces = publicWorkspaces?.filter(ws => !workspaces[ws.id]);


  return (
    <SafeAreaView style={styles.discoverContainer}>
        <Reanimated.View style={[styles.gestureContainer]}>
          <View style={styles.discoverheaderContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleLeftPanel}
            >
              <FontAwesome6 name="bars" size={20} color="#666" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Découvrir de nouveaux espaces</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onClose}
            >
              <FontAwesome6 name="xmark" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.workspaceList} contentContainerStyle={styles.workspaceListContent}>
            {filteredWorkspaces?.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Aucun espace de travail public disponible.
                  {'\n'}
                  N'hésitez pas à en créer un !
                </Text>
              </View>
            ) : (
              filteredWorkspaces.map(ws => (
                <View key={ws.id} style={styles.workspaceCard}>
                  <View style={styles.workspaceInfo}>
                    <Text style={styles.workspaceName}>{ws.name}</Text>
                    {ws.description && (
                      <Text style={styles.workspaceDescription}>{ws.description}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => onJoinWorkspace(ws)}
                  >
                    <Text style={styles.joinButtonText}>Rejoindre</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </Reanimated.View>
    </SafeAreaView>
  );
};

export default DiscoverWorkspaces;