import React from "react";
import InputField from "../InputField/InputField";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

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
    <form onSubmit={onSubmit}>
      <InputField
        label="Nom"
        type="text"
        theme={theme}
        value={name}
        required={true}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <InputField
        label="Description"
        type="text"
        theme={theme}
        value={description}
        required={true}
        onChange={(e) => onDescChange(e.target.value)}
      />
      <Checkbox
        label={<p>Espace de travail privé</p>}
        theme={theme}
        checked={isPrivate}
        onChange={onPrivacyToggle}
      />
      <Button type="submit" text="Créer" theme={theme} />
    </form>
  );
};

export default CreateWorkspaceForm;
