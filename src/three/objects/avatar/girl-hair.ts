import { Box3, BufferAttribute, CapsuleGeometry, Float32BufferAttribute, SkinnedMesh, SphereGeometry, Vector3 } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { resources } from "../../../utils/resources";

const addGirlHair = () => {
  const resource = resources.items["avatar-model"];
  const root = resource.scene.children[0];
  if (root.getObjectByName("girl-hair")) return;

  const headObject = root.getObjectByName("head");
  if (!(headObject instanceof SkinnedMesh)) return;
  const head = headObject;

  root.updateMatrixWorld(true);

  const bounds = new Box3();
  const point = new Vector3();
  const position = head.geometry.getAttribute("position");

  for (let index = 0; index < position.count; index++) {
    head.getVertexPosition(index, point).applyMatrix4(head.matrixWorld);
    bounds.expandByPoint(point);
  }

  const center = bounds.getCenter(new Vector3());
  const width = bounds.max.x - bounds.min.x;
  const depth = bounds.max.z - bounds.min.z;
  const headBoneIndex = head.skeleton.bones.findIndex((bone) => bone.name === "headBone");
  if (headBoneIndex < 0) return;

  const pieces = [];

  const crown = new SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  crown.scale(width * 0.47, 0.43, depth * 0.48);
  crown.translate(center.x, bounds.max.y - 0.1, center.z);
  pieces.push(crown);

  for (const side of [-1, 1]) {
    const lock = new CapsuleGeometry(0.14, 0.52, 5, 12);
    lock.scale(1, 1, 1);
    lock.translate(center.x + side * width * 0.36, center.y - 0.34, center.z + depth * 0.12);
    pieces.push(lock);
  }

  const bangs = new SphereGeometry(1, 20, 12);
  bangs.scale(width * 0.22, 0.17, 0.12);
  bangs.translate(center.x, bounds.max.y - 0.3, bounds.min.z + 0.16);
  pieces.push(bangs);

  const geometry = mergeGeometries(pieces);
  if (!geometry) return;

  geometry.applyMatrix4(root.matrixWorld.clone().invert());

  const joints = new Uint16Array(geometry.getAttribute("position").count * 4);
  const weights = new Float32Array(geometry.getAttribute("position").count * 4);
  for (let index = 0; index < geometry.getAttribute("position").count; index++) {
    joints[index * 4] = headBoneIndex;
    weights[index * 4] = 1;
  }
  geometry.setAttribute("skinIndex", new BufferAttribute(joints, 4));
  geometry.setAttribute("skinWeight", new Float32BufferAttribute(weights, 4));

  const hair = new SkinnedMesh(geometry, head.material);
  hair.name = "girl-hair";
  hair.bind(head.skeleton, head.bindMatrix.clone());
  hair.frustumCulled = false;
  root.add(hair);
};

const addGirlHairSafely = () => {
  try {
    addGirlHair();
  } catch (error) {
    // The hair is decorative; a model-specific issue must not stop the avatar scene from initializing.
    console.warn("Could not add the avatar hairstyle:", error);
  }
};

export { addGirlHairSafely as addGirlHair };
