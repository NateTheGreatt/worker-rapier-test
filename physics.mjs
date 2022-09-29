import RAPIER from "https://cdn.skypack.dev/@dimforge/rapier3d-compat";

const speed = 1;
const scale = 200;

export const initPhysics = async () => {
  await RAPIER.init();

  const gravity = {
    x: 0.0,
    // y: -9.81,
    y: 0.0,
    z: 0.0,
  };
  const world = new RAPIER.World(gravity);

  // world.integrationParameters.erp = 0;

  const cubeSize = 3;

  const groundDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    0.0,
    -0.1,
    0.0
  );
  const groundRigidBody = world.createRigidBody(groundDesc);
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
  world.createCollider(groundColliderDesc, groundRigidBody);

  const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
  const rigidBody = world.createRigidBody(rigidBodyDesc);
  const colliderDesc = RAPIER.ColliderDesc.cuboid(cubeSize, cubeSize, cubeSize);
  world.createCollider(colliderDesc, rigidBody);
  rigidBody.setTranslation({ x: -scale / 2, y: 10, z: -60 });

  return [world, rigidBody];
};

let ticks = 0
export const PhysicsSystem = (world, rigidBody, elapsed, dt) => {
  const t = rigidBody.translation();

  t.x += Math.sin(elapsed * speed) * scale/2 *dt
  // t.z += Math.cos(elapsed * speed) * scale/2 * dt;

  rigidBody.setNextKinematicTranslation(t);

  if (++ticks % 1 === 0) {
    world.step();
  }

  return world.debugRender();
};
