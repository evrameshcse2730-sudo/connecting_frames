import * as THREE from "three";
import { PALETTE } from "./rig.js";

const roundRect = (g, x, y, w, h, r) => {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else g.rect(x, y, w, h);
  g.fill();
};

// 4 film frames stacked vertically; repeats along the strip
export const FRAME_ASPECT = 160 / 128; // frame height / strip width

export function filmStripTexture() {
  const W = 128;
  const FH = 160;
  const tints = [PALETTE.brown, PALETTE.olive, "#cdbb9c", PALETTE.sun];
  const c = document.createElement("canvas");
  c.width = W;
  c.height = FH * tints.length;
  const g = c.getContext("2d");

  g.fillStyle = PALETTE.inkDeep;
  g.fillRect(0, 0, c.width, c.height);

  tints.forEach((tint, i) => {
    const y = i * FH;
    g.fillStyle = PALETTE.paper;
    for (let k = 0; k < 4; k++) {
      roundRect(g, 7, y + 9 + k * 38, 13, 22, 4);
      roundRect(g, W - 20, y + 9 + k * 38, 13, 22, 4);
    }
    const grad = g.createLinearGradient(0, y + 12, 0, y + FH - 12);
    grad.addColorStop(0, tint);
    grad.addColorStop(1, PALETTE.paper);
    g.fillStyle = grad;
    roundRect(g, 28, y + 12, W - 56, FH - 24, 6);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function loadLogoTexture() {
  const tex = new THREE.TextureLoader().load("/logo.webp");
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
