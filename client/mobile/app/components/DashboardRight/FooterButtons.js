import { View, Button } from 'react-native';
import styles from './DashboardRightStyle';

const FooterButtons = ({ hideAllPopup, updatePopupState, setMousePosition }) => {
  return (
    <View style={styles.footerContainer}>
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