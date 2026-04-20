import { AccessToken } from "livekit-server-sdk";

export async function createDebaterToken(
  roomName: string,
  participantName: string,
  isDebater: boolean
) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: participantName }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isDebater,
    canSubscribe: true,
    canPublishData: isDebater,
  });

  return await at.toJwt();
}
