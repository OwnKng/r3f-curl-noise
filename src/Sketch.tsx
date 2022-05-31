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
  const numPoints = 500
  const step = 3
  const amplitude = 0.001

  const points = []
  points.push(start)
  let currentPoint = start.clone()

  for (let i = 1; i < numPoints; i++) {
    const point = computeCurl(
      currentPoint.x / step,
      currentPoint.y / step,
      currentPoint.z / step
    )

    currentPoint.addScaledVector(point, amplitude)
    points.push(currentPoint.clone())
  }

  return points
}

const radius = 10

const Sketch = () => {
  const ref = useRef()

  const curves = useMemo(() => {
    const curves = []

    const origin = new THREE.Vector3()

    for (let i = 0; i < 500; i++) {
      origin.set(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random())
      origin.normalize().multiplyScalar(30 * 0.2)

      const points = createCurve(origin)

      const spherePoints = []

      for (let i = 0; i < points.length; i++) {
        const { x, y, z } = points[i]

        //spherePoints[i] = projectToSphere(radius, x, y)
        spherePoints[i] = new THREE.Vector3(x, y, z).normalize()
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
    <group>
      {curves.map((curve, i) => (
        <primitive key={i} object={curve} />
      ))}
    </group>
  )
}

export default Sketch
