import { computeCurl } from "./util/curl"
import * as THREE from "three"
import { useMemo, useRef } from "react"
import { Vector2 } from "three"

const radians = (degrees: number) => degrees * (Math.PI / 180)

const projectToSphere = (radius: number, x: number, y: number) => {
  const theta = radians(y) + Math.PI / 2
  const phi = radians(x) + Math.PI

  return new THREE.Vector3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  )
}

const createCurve = (start: Vector2) => {
  const numPoints = 500
  const step = 3
  const amplitude = 0.001

  const points = []
  points.push(start)
  let currentPoint = start.clone()

  for (let i = 1; i < numPoints; i++) {
    const [x, y] = computeCurl(currentPoint.x / step, currentPoint.y / step)

    currentPoint.addScaledVector(new THREE.Vector2(x, y), amplitude)
    points.push(currentPoint.clone())
  }

  return points
}

const radius = 10

const Sketch = () => {
  const ref = useRef()

  const curves = useMemo(() => {
    const curves = []

    for (let i = 0; i < 500; i++) {
      const points = createCurve(
        new THREE.Vector2(Math.random() * 10, Math.random() * 10)
      )

      const spherePoints = []

      for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i]

        //spherePoints[i] = projectToSphere(radius, x, y)
        spherePoints[i] = new THREE.Vector3(x, y, 0)
      }

      const path = new THREE.CatmullRomCurve3(spherePoints)

      curves.push(
        new THREE.Mesh(
          new THREE.TubeBufferGeometry(path, 600, 0.01, 8, false),
          new THREE.MeshBasicMaterial()
        )
      )
    }

    return curves
  }, [])

  return (
    <group scale={[2, 2, 10]}>
      {curves.map((curve, i) => (
        <primitive key={i} object={curve} />
      ))}
    </group>
  )
}

export default Sketch
