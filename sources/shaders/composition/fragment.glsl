varying vec2 vUv;

uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uConvergencePosition;

#include ../partials/inverseLerp.glsl
#include ../partials/remap.glsl

void main() {
  float distortionStrength = texture(uDistortionTexture, vUv).r;
  vec2 convergencePoint = vec2(0.5);
  vec2 toConvergence = uConvergencePosition - vUv;
  vec2 distoredUv = vUv + toConvergence * distortionStrength;

  vec4 color = texture(uDefaultTexture, distoredUv);

  // Vignette
  float distanceToCenter = length(vUv - 0.5);
  float vignetteStrength = remap(distanceToCenter, 0.3, 0.7, 0.0, 1.0);
  vignetteStrength = smoothstep(0.0, 1.0, vignetteStrength);
  color.rgb = mix(color.rgb, vec3(0.0), vignetteStrength);

  gl_FragColor = color;
}
