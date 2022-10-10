uniform sampler2D uGradientTexture;

varying vec2 vUv;

void main() {
  vec4 color = texture(uGradientTexture, vUv);
  gl_FragColor = color;
}
