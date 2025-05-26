import { View, Button } from 'react-native';

const FooterButtons = ({ hideAllPopup, updatePopupState, setMousePosition }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Button title="Uploader un fichier" onPress={() => {}} />
      <Button
        title="Insérer un émoji"
        onPress={(event) => {
          hideAllPopup();
          updatePopupState("emojis", true);
        }}
      />
    </View>
  );
};

export default FooterButtons;