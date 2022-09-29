import { initPhysics, PhysicsSystem } from "./physics.mjs";

export const createGame = async (worker = false) => {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 200;
  document.body.appendChild(canvas);
  document.body.appendChild(document.createElement("br"));
  const app = new pc.Application(canvas, {});

  const camera = new pc.Entity("camera");
  camera.addComponent("camera", {
    clearColor: new pc.Color(0.5, 0.6, 0.9),
  });
  app.root.addChild(camera);
  camera.setPosition(0, 1, 10);

  let data, world, rigidBody;

  if (worker) {
    const worker = new Worker("worker.mjs", { type: "module" });
    worker.addEventListener("message", (d) => {
      data = d.data;
    });
  } else {
    [world, rigidBody] = await initPhysics();
  }

  const draw = () => {
    if (data) {
      const layer = app.scene.layers.getLayerById(pc.LAYERID_UI);
      app.drawLineArrays(data.vertices, data.colors, false, layer);
    }
  };

  let elapsed = 0;
  let dt = 0;
  let then = performance.now();

  const update = () => {
    requestAnimationFrame(update);

    const now = performance.now();
    dt = (now - then) / 1000;
    then = now;
    elapsed += dt;

    if (!worker) {
      data = PhysicsSystem(world, rigidBody, elapsed, dt);
    }

    draw();
  };

  requestAnimationFrame(update);

  app.start();

  return app;
};
