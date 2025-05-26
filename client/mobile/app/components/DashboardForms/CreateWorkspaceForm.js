import { View } from 'react-native';
import InputField from '../InputField/InputField';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';

const CreateWorkspaceForm = ({
  theme,
  name,
  description,
  isPrivate,
  onNameChange,
  onDescChange,
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
      <InputField
        label="Description"
        type="text"
        theme={theme}
        value={description}
        required={true}
        onChange={(value) => onDescChange(value)}
      />
      <Checkbox
        label="Espace de travail privé"
        theme={theme}
        onChange={onPrivacyToggle}
      />
      <Button type="submit" text="Créer" theme={theme} onClick={onSubmit} />
    </View>
  );
};

export default CreateWorkspaceForm;