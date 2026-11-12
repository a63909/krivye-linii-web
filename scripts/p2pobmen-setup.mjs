import { fileURLToPath } from "node:url";
import { createSetupServer } from "./lib/p2pobmen-setup.mjs";

const directory = fileURLToPath(new URL("../.p2pobmen-auth/", import.meta.url));
const port = Number(process.env.P2POBMEN_SETUP_PORT || 4021);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Некорректный порт формы настройки");
const { server, accessToken } = await createSetupServer({ directory });
server.listen(port, "127.0.0.1", () => {
  console.info(`Откройте форму на этом компьютере: http://127.0.0.1:${port}/#setup=${accessToken}`);
  console.info("Форма доступна только локально. Пароль, код и ключи не выводятся в журнал.");
  console.info("После настройки закройте помощник: Ctrl+C.");
});
