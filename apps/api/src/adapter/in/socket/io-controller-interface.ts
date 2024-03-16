import { Server, Socket } from 'socket.io';

type IoControllerInterface<T> = (
  socket: Socket,
  io: Server,
    ...useCases: T[]
  ) => void;

export default IoControllerInterface;
