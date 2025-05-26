import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const ChannelList = ({ channels, setSelectedChannel, selectedChannel, getBackground, getForeground }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChannels = Object.values(channels).filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View>
      <TextInput
        placeholder="Rechercher un canal..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ padding: 8, borderWidth: 1, marginBottom: 10 }}
      />
      {filteredChannels.length > 0 ? (
        filteredChannels.map(channel => {
          const isSelected = selectedChannel?.id === channel.id;

          return (
            <TouchableOpacity
              key={channel.id}
              onPress={() => setSelectedChannel(channel)}
              style={{
                backgroundColor: getBackground(channel.name),
                padding: 10,
                marginVertical: 4,
                borderColor: isSelected ? '#fff' : 'transparent',
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              <Text style={{ color: getForeground(channel.name), fontWeight: isSelected ? 'bold' : 'normal' }}>
                {channel.name} {channel.is_private ? '🔒' : ''}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text>Aucun canal trouvé</Text>
      )}
    </View>
  );
};

export default ChannelList;