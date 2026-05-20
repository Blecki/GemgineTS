attribute vec4 aVertexPosition; 
uniform mat4 uModelViewMatrix; 
uniform mat4 uProjectionMatrix;
attribute vec2 aTexcoord;
varying vec2 vTexcoord;  

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTexcoord = aTexcoord;
}