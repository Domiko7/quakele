<template>
  <div class="beachball-container">
    <canvas 
      ref="canvasRef" 
      :width="size" 
      :height="size"
      class="beachball-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { stereographicToUnitVector, getPRadiation } from "../data/focalMechanisms.ts";
import { FocalMechanism } from "../types";

const props = withDefaults(defineProps<{
  strike: number;
  dip: number;
  rake: number;
  size?: number;
  compressionalColor?: string;
  dilatationalColor?: string;
}>(), {
  size: 300,
  compressionalColor: "#e8612c",
  dilatationalColor: "#ffffff"
});

const canvasRef = ref<HTMLCanvasElement | null>(null);

const drawBeachBall = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = props.size;
  const radius = (size / 2) * 0.92;
  const centerX = size / 2;
  const centerY = size / 2;

  const fm: FocalMechanism = { 
    strike: props.strike, 
    dip: props.dip, 
    rake: props.rake 
  };

  ctx.clearRect(0, 0, size, size);

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const cColor = hexToRgb(props.compressionalColor);
  const dColor = hexToRgb(props.dilatationalColor);

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const nx = (px - centerX) / radius;
      const ny = (py - centerY) / radius;

      const vec = stereographicToUnitVector(nx, ny);
      if (!vec) continue;

      const pRad = getPRadiation(fm, vec);

      const pixelIndex = (py * size + px) * 4;
      const color = pRad >= 0 ? cColor : dColor;

      data[pixelIndex] = color.r;
      data[pixelIndex + 1] = color.g;
      data[pixelIndex + 2] = color.b;
      data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.lineTo(centerX, centerY - radius + 8);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

onMounted(() => drawBeachBall());
watch(() => [props.strike, props.dip, props.rake, props.size, props.compressionalColor, props.dilatationalColor], drawBeachBall);
</script>

<style scoped>
.beachball-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.beachball-canvas {
  border-radius: 50%;
}
</style>