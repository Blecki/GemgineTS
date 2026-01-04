precision highp float;

uniform sampler2D u_diffuse;
uniform sampler2D u_objects;
uniform sampler2D u_normals;
uniform sampler2D u_collision;
varying vec2 v_texcoord;

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
  
  float destx = 528.0 * v_texcoord.x;
  float desty = 224.0 * v_texcoord.y;

  vec3 lighting = vec3(0.1, 0.1, 0.1);
  vec4 object = texture2D(u_objects, v_texcoord);
  
  if (object.a > 0.5) 
  {
    for (int i = 0; i < MAX_LIGHTS; i++) 
    {
      if (i >= u_numActiveLights) break; 
      float distanceToLight = sqrt(
        ((destx - u_lights[i].position.x) * (destx - u_lights[i].position.x)) +
        ((desty - u_lights[i].position.y) * (desty - u_lights[i].position.y)) 
      );
      float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius));
      
      lighting = vec3(lighting.r + (lightIntensity * u_lights[i].color.r * u_lights[i].intensity),
                  lighting.g + (lightIntensity * u_lights[i].color.g * u_lights[i].intensity),
                  lighting.b + (lightIntensity * u_lights[i].color.b * u_lights[i].intensity));
    }      

    gl_FragColor = vec4(object.r * lighting.r, 
                    object.g * lighting.g,
                    object.b * lighting.b,
                    1.0);
  }
  else 
  {
    vec4 diffuse = texture2D(u_diffuse, v_texcoord);
    vec4 normal = texture2D(u_normals, v_texcoord);
    vec4 collision = texture2D(u_collision, v_texcoord);
    vec3 surfaceNormal = vec3((2.0 * normal.r) - 1.0, (2.0 * normal.g) - 1.0, (2.0 * normal.b) - 1.0);

    for (int i = 0; i < MAX_LIGHTS; i++) 
    {
      if (i >= u_numActiveLights) break; 
      float distanceToLight = sqrt(
        ((destx - u_lights[i].position.x) * (destx - u_lights[i].position.x)) +
        ((desty - u_lights[i].position.y) * (desty - u_lights[i].position.y)) 
      );
      vec3 lightDirection = vec3(u_lights[i].position.x - destx, u_lights[i].position.y - desty, 64.0);

      if (collision.r < 0.5) {
        vec2 halfLight = vec2(lightDirection.x / 2.0, lightDirection.y / 2.0);
        vec2 objectIntersection = vec2((halfLight.x + destx) / 528.0, (halfLight.y + desty) / 224.0);
        vec4 objectShadow = texture2D(u_objects, objectIntersection);
        if (objectShadow.a > 0.5) continue;
      }
      
      float cosAngle = dot(normalize(surfaceNormal), normalize(lightDirection));
      float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius)) * max(0.0, cosAngle);
      float shininess = 64.0; 
      float specularIntensity = min(lightIntensity, pow(max(0.0, cosAngle), shininess));

      lighting = vec3(
        lighting.r + ((lightIntensity + specularIntensity) * u_lights[i].color.r * u_lights[i].intensity),
        lighting.g + ((lightIntensity + specularIntensity) * u_lights[i].color.g * u_lights[i].intensity),
        lighting.b + ((lightIntensity + specularIntensity) * u_lights[i].color.b * u_lights[i].intensity));
    }      

    gl_FragColor = vec4( diffuse.r * (floor(lighting.r * 4.0) / 4.0), 
                          diffuse.g * (floor(lighting.g * 4.0) / 4.0),
                          diffuse.b * (floor(lighting.b * 4.0) / 4.0),
                          1.0);
  }
}