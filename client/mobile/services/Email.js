
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

export const sendEmail = async (body, api_url) => {
  const url = api_url ?? API_URL;
  const response = await fetch(`${url}email/send`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};
