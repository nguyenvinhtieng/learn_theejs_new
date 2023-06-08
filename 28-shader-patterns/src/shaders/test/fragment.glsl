varying vec2 uUv;

void main()
{
    // gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);

    // Pattern 1
    // gl_FragColor = vec4(uUv, 1, 1.0);

    // Pattern 2
    // gl_FragColor = vec4(uUv, 0, 1.0);

    // Pattern 3
    // float strength = uUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 4
    // float strength = uUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 5
    // float strength = 1.0 - uUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 6
    // float strength = uUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 7
    // float strength = uUv.x * 10.0;
}