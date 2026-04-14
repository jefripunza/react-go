import { Gotify } from "gotify";

export const client = new Gotify({
  server: "http://gotify.example.com",
});

export const sendNotification = async (title: string, message: string) => {
  await client.send({
    app: "yourAppToken",
    title,
    message,
    priority: 5,
  });
};
