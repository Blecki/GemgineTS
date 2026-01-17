precision highp float;

uniform sampler2D u_background_diffuse;
uniform sampler2D u_objects_diffuse;
varying vec2 v_texcoord;

void main() {
  vec4 object = texture2D(u_objects_diffuse, v_texcoord);
  
  if (object.a > 0.5) 
  {    
    gl_FragColor = object;
  }
  else 
  {
    vec4 diffuse = texture2D(u_background_diffuse, v_texcoord);
    gl_FragColor = diffuse;
  }
}