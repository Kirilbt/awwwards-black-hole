varying vec2 vUv;

uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;

void main() {
  float distortionStrength = texture(uDistortionTexture, vUv).r;
  vec2 convergencePoint = vec2(0.5);
  vec2 toConvergence = convergencePoint - vUv;
  vec2 distoredUv = vUv + toConvergence * distortionStrength;

  vec4 color = texture(uDefaultTexture, distoredUv);
  vec4 temp = texture(uDistortionTexture, vUv);
  gl_FragColor = temp;
}
