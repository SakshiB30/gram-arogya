import { useEffect, useState } from "react";
import { addNetworkListeners, isOnline } from "./network";

const useNetworkStatus = () => {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const cleanup = addNetworkListeners({
      onOnline: () => setOnline(true),
      onOffline: () => setOnline(false),
    });

    return cleanup;
  }, []);

  return online;
};

export default useNetworkStatus;