/* */ 
"format cjs";
import curveRadial, {curveRadialLinear} from "./curve/radial";
import line from "./line";

export function lineRadial(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function(_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return l;
}

export default function() {
  return lineRadial(line().curve(curveRadialLinear));
}
