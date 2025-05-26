import { View } from 'react-native';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';

const JoinWorkspaceForm = ({ theme, token, onTokenChange, onSubmit }) => {
  return (
    <View>
      <InputField
        label="Lien d'invitation ou token"
        type="text"
        theme={theme}
        value={token}
        required={true}
        onChange={(value) => onTokenChange(value.trim())}
      />
      <Button type="submit" text="Rejoindre" theme={theme} onClick={onSubmit} />
    </View>
  );
};

export default JoinWorkspaceForm;