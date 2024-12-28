import Toolbar from "../components/toolbar";
import Panel from "../components/panel";
import { useEventEmitter } from "ahooks";
import { EventType } from "../types/event";
export default function MainLayout() {
  const bus = useEventEmitter<EventType>();
  return (
    <div>
      <div className="w-full fixed">
        <Toolbar bus={bus} />
      </div>
      <Panel bus={bus} />
    </div>
  );
}
