import { createGame } from "./game.mjs";

const main = async () => {
  await createGame();
  await createGame(true);
};

main();
