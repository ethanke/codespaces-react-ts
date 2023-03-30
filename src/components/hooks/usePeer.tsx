import { useState, useEffect } from "react";
import SimplePeer from "simple-peer";

type SignalData = {
  peerId: string;
  signal: SimplePeer.SignalData;
};

export const usePeer = (
  initiator: boolean,
  onData: (data: any) => void
): [SimplePeer.Instance | null, string] => {
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [peerId, setPeerId] = useState<string>("");

  useEffect(() => {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
    });

    peer.on("signal", (data) => {
      setPeerId(JSON.stringify({ signal: data }));
    });

    peer.on("data", (data) => {
      onData(JSON.parse(data.toString()));
    });

    peer.on("connect", () => {
      setPeer(peer);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    if (peer && peerId) {
      const { signal } = JSON.parse(peerId) as SignalData;
      peer.signal(signal);
    }
  }, [peer, peerId]);

  return [peer, peerId];
};
