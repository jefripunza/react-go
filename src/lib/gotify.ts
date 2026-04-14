import { GotifyClient } from "gotify-client";

const client = new GotifyClient("http://gotify.home", {
  // You must specify at least 1 key
  app: "app_api_key",
  client: "client_api_key",
});

export const sendNotification = async (_title: string, _message: string) => {
  await client.message.createMessage({
    message: "Test message!",
  });
};
