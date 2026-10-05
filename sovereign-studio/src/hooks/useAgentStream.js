import { useState, useEffect, useRef } from 'react';

export function useAgentStream(url) {
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.log) setLogs((prev) => [...prev, payload.log]);
      if (payload.step) setCurrentStep(payload.step);
    };

    return () => ws.close();
  }, [url]);

  return { logs, currentStep, isConnected };
}