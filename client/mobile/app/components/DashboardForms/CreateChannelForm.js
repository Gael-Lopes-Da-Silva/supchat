import { View } from 'react-native';
import InputField from '../InputField/InputField';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';

const CreateChannelForm = ({
  theme,
  name,
  isPrivate,
  onNameChange,
  onPrivacyToggle,
  onSubmit,
}) => {
  return (
    <View>
      <InputField
        label="Nom"
        type="text"
        theme={theme}
        value={name}
        required={true}
        onChange={(value) => onNameChange(value)}
      />
      <Checkbox
        label="Channel privé"
        theme={theme}
        checked={isPrivate}
        onChange={onPrivacyToggle}
      />
      <Button type="submit" text="Créer" theme={theme} onClick={onSubmit} />
    </View>
  );
};

export default CreateChannelForm;