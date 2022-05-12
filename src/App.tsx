import "./App.css"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Sketch from "./Sketch"

const App = () => (
  <div className='App'>
    <Canvas>
      <OrbitControls />
      <Sketch />
    </Canvas>
  </div>
)

export default App
