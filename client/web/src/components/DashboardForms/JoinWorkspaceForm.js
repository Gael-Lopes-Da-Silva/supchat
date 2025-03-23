import React from "react";
import InputField from "../InputField/InputField";
import Button from "../Button/Button";

const JoinWorkspaceForm = ({ theme, token, onTokenChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField
        label="Lien d'invitation ou token"
        type="text"
        theme={theme}
        value={token}
        required={true}
        onChange={(e) => onTokenChange(e.target.value.trim())}
      />
      <Button type="submit" text="Rejoindre" theme={theme} />
    </form>
  );
};

export default JoinWorkspaceForm;
