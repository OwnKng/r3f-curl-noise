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
  const numPoints = 600
  const scale = 10
  const amplitude = 0.001

  const points = []
  points.push(start)
  let currentPoint = start.clone()

  for (let i = 1; i < numPoints; i++) {
    const velocity = computeCurl(
      currentPoint.x / scale,
      currentPoint.y / scale,
      currentPoint.z / scale
    )

    currentPoint.addScaledVector(velocity, amplitude)
    points.push(currentPoint.clone())
  }

  console.log(points)

  return points
}

const radius = 1

const Sketch = () => {
  const ref = useRef()

  const curves = useMemo(() => {
    const curves = []

    for (let i = 0; i < 40; i++) {
      const points = createCurve(
        new THREE.Vector3(Math.random(), Math.random(), Math.random())
      )

      const spherePoints = []

      for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i]

        spherePoints[i] = projectToSphere(radius, x, y)
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
        <primitive scale={10} key={i} object={curve} />
      ))}
    </group>
  )
}

export default Sketch
