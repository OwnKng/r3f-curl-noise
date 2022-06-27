import { computeCurl } from "./util/curl"
import * as THREE from "three"
import { useMemo, useRef } from "react"
import { Group, Vector3 } from "three"
import { vertex } from "./shaders/vertex"
import { fragment } from "./shaders/fragment"
import { useFrame } from "@react-three/fiber"

const colors = [
  new THREE.Color(0x5adbff),
  new THREE.Color(0x006daa),
  new THREE.Color(0xf15152),
]

const createCurve = (start: Vector3) => {
  const numPoints = 500
  const frequency = 0.1
  const step = 0.0025

  const points = []
  points.push(start)
  let currentPoint = start.clone()

  for (let i = 1; i < numPoints; i++) {
    const point = computeCurl(
      currentPoint.x * frequency,
      currentPoint.y * frequency,
      currentPoint.z * frequency
    )

    currentPoint.addScaledVector(point, step)

    points.push(currentPoint.clone())
  }

  return points.map((point) => point.normalize())
}

const Sketch = () => {
  const ref = useRef<Group>(null!)

  const curves = useMemo(() => {
    const curves = []

    const origin = new THREE.Vector3()

    for (let i = 0; i < 2000; i++) {
      origin.set(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random())
      origin.normalize().multiplyScalar(10)

      const points = createCurve(origin)
      const path = new THREE.CatmullRomCurve3(points)

      curves.push(
        new THREE.Mesh(
          new THREE.TubeBufferGeometry(path, 100, 0.0015, 8, false),
          new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
            uniforms: {
              uTime: { value: 0 },
              uOffset: { value: Math.random() },
              uSpeed: { value: Math.random() },
              uColor: { value: colors[Math.floor(Math.random() * 3)] },
            },
          })
        )
      )
    }

    return curves
  }, [])

  useFrame(({ clock }) => {
    const { children } = ref.current
    for (let i = 0; i < children.length; i++) {
      //@ts-ignore
      children[i].material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <group ref={ref}>
      {curves.map((curve, i) => (
        <primitive key={i} object={curve} />
      ))}
    </group>
  )
}

export default Sketch
