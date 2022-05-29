import { computeCurl } from "./util/curl"
import * as THREE from "three"
import { useMemo, useRef } from "react"
import { Vector3 } from "three"

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

const createCurve = (start: Vector3) => {
  const numPoints = 1000
  const frequency = 3
  const amplitude = 1

  const points = []
  points.push(start)
  let currentPoint = start.clone()

  for (let i = 1; i < numPoints; i++) {
    const vector = computeCurl(
      currentPoint.x / frequency,
      currentPoint.y / frequency,
      currentPoint.z / frequency
    )

    currentPoint.addScaledVector(vector, amplitude)
    points.push(currentPoint.clone())
  }

  return points
}

const radius = 1

const Sketch = () => {
  const ref = useRef()

  const curves = useMemo(() => {
    const curves = []

    for (let i = 0; i < 10; i++) {
      const points = createCurve(new THREE.Vector3(i / 10, i / 10, i / 10))

      const spherePoints = []

      for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i]

        spherePoints[i] = projectToSphere(radius, x, y)
      }

      const path = new THREE.CatmullRomCurve3(spherePoints)

      curves.push(
        new THREE.Mesh(
          new THREE.TubeBufferGeometry(path, 500, 0.001, 8, false),
          new THREE.MeshBasicMaterial()
        )
      )
    }

    return curves
  }, [])

  return (
    <group>
      {curves.map((curve, i) => (
        <primitive key={i} object={curve} />
      ))}
    </group>
  )
}

export default Sketch
