precision mediump float;

uniform sampler2D u_texture;
varying vec2 vTexcoord;

void main(void) { 
  vec4 diffuse = texture2D(u_texture, vTexcoord);
  gl_FragColor = diffuse;
}