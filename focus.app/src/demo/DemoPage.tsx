import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Link } from "react-router-dom";

export function DemoPage() {
  return (
    <>
      <h1>Demo</h1>

      <ul>
        <li>
          <Link to="dnd"><DragIndicatorIcon/> Drag & Drop</Link>
        </li>
      </ul>
    </>
  );
}
