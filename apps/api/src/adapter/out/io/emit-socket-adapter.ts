import {Server} from "socket.io";
import { EmitSocketPort } from "@/application/port/out/emit-socket-port";

function CreateSocketEmitAdapter(
    io: Server
): EmitSocketPort {
    return function (props) {
        if (props.room) {
            io.to(props.room).emit(props.event, props.data);
            return;
        }
        io.emit(props.event, props.data);
    };
}
export default CreateSocketEmitAdapter;