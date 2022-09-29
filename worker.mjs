import { initPhysics, PhysicsSystem } from "./physics.mjs";

const tickRate = 120;

export const init = async () => {
  let elapsed = 0;
  let dt = 0;
  let then = performance.now();

  const [world, rigidBody] = await initPhysics();

  const gameLoop = () => {
    const now = performance.now();
    dt = (now - then) / 1000;
    then = now;
    elapsed += dt;

    const debugData = PhysicsSystem(world, rigidBody, elapsed, dt);

    postMessage(debugData);
  };

  const intervalLoop = () => setInterval(gameLoop, 1000 / tickRate);

  const timeoutLoop = () => {
    setTimeout(timeoutLoop, 1000 / tickRate);
    gameLoop();
  };

  intervalLoop();
  // timeoutLoop();
};

init();
