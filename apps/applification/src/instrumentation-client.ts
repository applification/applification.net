import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    { path: "/api/contact/prepare", method: "POST" },
    { path: "/api/contact/attachment", method: "POST" },
    { path: "/api/contact/attachment", method: "DELETE" },
    { path: "/api/contact/deliver", method: "POST" },
  ],
});
