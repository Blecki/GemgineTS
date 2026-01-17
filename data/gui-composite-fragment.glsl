precision highp float;

uniform sampler2D u_gui;
varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_gui, v_texcoord);
}