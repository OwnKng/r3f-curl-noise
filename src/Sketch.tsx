import { computeCurl } from "./util/curl"
import * as THREE from "three"
import { useMemo } from "react"

const createCurve = () => {
  const frequency = 1
  const amplitude = 1

  const sphere = new THREE.SphereBufferGeometry()
  const { array, count } = sphere.attributes.position

  const points = []
  const start = new THREE.Vector3(array[0], array[1], array[2])

  points.push(start)
  let currentPoint = start.clone()

  for (let i = 0; i < count; i++) {
    const point = new THREE.Vector3(
      array[i * 3 + 0],
      array[i * 3 + 1],
      array[i * 3 + 2]
    )

    const vector = computeCurl(
      point.x * frequency,
      point.y * frequency,
      point.z * frequency
    )

    currentPoint.addScaledVector(vector, amplitude)

    points.push(currentPoint.clone())
  }

  return points
}

const Sketch = () => {
  const curve = useMemo(() => {
    const path = new THREE.CatmullRomCurve3(createCurve())

    return new THREE.Mesh(
      new THREE.TubeBufferGeometry(path, 600, 0.005, 8, false),
      new THREE.MeshBasicMaterial()
    )
  }, [])

  return (
    <group>
      <primitive object={curve} />
    </group>
  )
}

export default Sketch
