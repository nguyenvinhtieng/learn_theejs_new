varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Pattern 1

    // Pattern 2

    // Pattern 3

    vUv = uv;
}