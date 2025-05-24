import React from "react";
import InputField from "../InputField/InputField";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

const CreateChannelForm = ({
  theme,
  name,
  isPrivate,
  onNameChange,
  onPrivacyToggle,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField
        label="Nom"
        type="text"
        theme={theme}
        value={name}
        required={true}
        onChange={(e) => onNameChange(e.target.value)}
      />

      <Checkbox
        label={<p>Channel privé</p>}
        theme={theme}
        checked={isPrivate}
        onChange={onPrivacyToggle}
      />
      <Button type="submit" text="Créer" theme={theme} />
    </form>
  );
};

export default CreateChannelForm;
