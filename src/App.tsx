import "./App.css"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Sketch from "./Sketch"

const App = () => (
  <div className='App'>
    <Canvas camera={{ position: [0, 0, 2] }}>
      <Sketch />
      <OrbitControls />
    </Canvas>
  </div>
)

export default App
