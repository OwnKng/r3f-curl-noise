export const fragment = /* glsl */ `
    uniform float uTime; 
    varying vec2 vUv; 

    void main() {
        float alpha = sin(uTime * 0.1) * 0.5 + 0.5; 

        gl_FragColor = vec4(vec3(1.0), alpha); 
    }
`
