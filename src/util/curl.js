// https://al-ro.github.io/projects/embers/
import SimplexNoise from "simplex-noise"

const simplex = new SimplexNoise()

export function computeCurl(x, y) {
  var eps = 0.0001

  //Find rate of change in X direction
  var n1 = simplex.noise2D(x + eps, y)
  var n2 = simplex.noise2D(x - eps, y)

  //Average to find approximate derivative
  var a = (n1 - n2) / (2 * eps)

  //Find rate of change in Y direction
  var n1 = simplex.noise2D(x, y + eps)
  var n2 = simplex.noise2D(x, y - eps)

  //Average to find approximate derivative
  var b = (n1 - n2) / (2 * eps)

  //Curl
  return [b, -a]
}
