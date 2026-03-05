import { clients } from "./websocket";

interface Props {
  ids: number[];
  message: string;
  senderId: number;
  type: string;
}

export default function socketResponse(data: Props) {

  const { ids, senderId, message, type } = data;
  ids.forEach((id) => {
    if (id && id !== senderId) {
      clients.get(id)?.send(
        JSON.stringify({
          message,
          senderId,
          type,
        })
      );
    }
  });
}
