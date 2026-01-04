precision highp float;

uniform sampler2D u_diffuse;
uniform sampler2D u_objects;
uniform sampler2D u_normals;
uniform sampler2D u_collision;
varying vec2 v_texcoord;
uniform vec2 u_screenDimensions;

const int MAX_LIGHTS = 5; 

struct Light {
    vec2 position;
    float radius;
    vec3 color;
    float intensity;
};

uniform Light u_lights[MAX_LIGHTS];
uniform int u_numActiveLights;

void main() {
  
  vec2 dest = u_screenDimensions * v_texcoord;

  vec3 lighting = vec3(0.1, 0.1, 0.1);
  vec4 object = texture2D(u_objects, v_texcoord);
  
  if (object.a > 0.5) 
  {
    for (int i = 0; i < MAX_LIGHTS; i++) 
    {
      if (i >= u_numActiveLights) break; 
      float distanceToLight = sqrt(
        ((dest.x - u_lights[i].position.x) * (dest.x - u_lights[i].position.x)) +
        ((dest.y - u_lights[i].position.y) * (dest.y - u_lights[i].position.y)) 
      );
      float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius));
      
      lighting += lightIntensity * u_lights[i].color * u_lights[i].intensity;
    }      

    gl_FragColor = object * vec4(lighting, 1.0);
  }
  else 
  {
    vec4 diffuse = texture2D(u_diffuse, v_texcoord);
    vec3 normal = texture2D(u_normals, v_texcoord).xyz;
    vec4 collision = texture2D(u_collision, v_texcoord);
    vec3 surfaceNormal = (2.0 * normal) - 1.0;

    for (int i = 0; i < MAX_LIGHTS; i++) 
    {
      if (i >= u_numActiveLights) break; 
      float distanceToLight = sqrt(
        ((dest.x - u_lights[i].position.x) * (dest.x - u_lights[i].position.x)) +
        ((dest.y - u_lights[i].position.y) * (dest.y - u_lights[i].position.y)) 
      );
      vec3 lightDirection = vec3(u_lights[i].position.x - dest.x, u_lights[i].position.y - dest.y, 64.0);

      if (collision.r < 0.5) {
        vec2 halfLight = vec2(lightDirection.x / 2.0, lightDirection.y / 2.0);
        vec2 objectIntersection = vec2((halfLight.x + dest.x) / u_screenDimensions.x, (halfLight.y + dest.y) / u_screenDimensions.y);
        vec4 objectShadow = texture2D(u_objects, objectIntersection);
        if (objectShadow.a > 0.5) continue;
      }
      
      float cosAngle = dot(normalize(surfaceNormal), normalize(lightDirection));
      float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius)) * max(0.0, cosAngle);
      float shininess = 64.0; 
      float specularIntensity = min(lightIntensity, pow(max(0.0, cosAngle), shininess));

      lighting += (lightIntensity + specularIntensity) * u_lights[i].color * u_lights[i].intensity;
    }      

    gl_FragColor = diffuse * vec4(floor(lighting * 16.0) / 16.0, 1.0);
  }
}