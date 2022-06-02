export const fragment = /* glsl */ `
    uniform float uTime; 
    uniform float uOffset;
    uniform float uSpeed; 
    varying vec2 vUv; 

    void main() {
        float wave = fract((uTime * uSpeed) + uOffset); 

        float alpha = (smoothstep(wave - 0.4, wave, vUv.x) + 1.0 - step(wave, vUv.x)) - 1.0; 
        alpha = max(alpha, 0.2);
        
        gl_FragColor = vec4(vec3(0.1, 0.1, 0.1), alpha); 
    }
`
