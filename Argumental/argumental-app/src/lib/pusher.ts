import Pusher from "pusher";
import PusherJs from "pusher-js";

let _pusherServer: Pusher | null = null;

export function getPusherServer(): Pusher {
  if (!_pusherServer) {
    _pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return _pusherServer;
}

export function getPusherClient() {
  return new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });
}

export function debateChannel(debateId: string) {
  return `debate-${debateId}`;
}

export const VOTE_EVENT = "vote-update";
export const PHASE_EVENT = "phase-change";
