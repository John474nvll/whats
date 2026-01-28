import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';

interface TwilioVoiceState {
  device: Device | null;
  call: Call | null;
  status: 'offline' | 'ready' | 'connecting' | 'ringing' | 'in-call' | 'error';
  error: string | null;
  identity: string | null;
  isMuted: boolean;
  callDuration: number;
}

interface UseTwilioVoiceReturn extends TwilioVoiceState {
  initialize: (identity?: string) => Promise<void>;
  makeCall: (to: string, params?: Record<string, string>) => Promise<void>;
  endCall: () => void;
  acceptIncoming: () => void;
  rejectIncoming: () => void;
  toggleMute: () => void;
  sendDigits: (digits: string) => void;
}

export function useTwilioVoice(): UseTwilioVoiceReturn {
  const [state, setState] = useState<TwilioVoiceState>({
    device: null,
    call: null,
    status: 'offline',
    error: null,
    identity: null,
    isMuted: false,
    callDuration: 0,
  });

  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    const startTime = Date.now();
    durationIntervalRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        callDuration: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);
  }, []);

  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const initialize = useCallback(
    async (identity?: string) => {
      try {
        setState((prev) => ({ ...prev, status: 'connecting', error: null }));

        const response = await fetch(
          `/api/twilio/token?identity=${identity || ''}`,
        );
        const data = await response.json();

        if (data.error || !data.token) {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: data.error || 'Failed to get token',
          }));
          return;
        }

        const device = new Device(data.token, {
          logLevel: 1,
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        });

        device.on('registered', () => {
          setState((prev) => ({ ...prev, status: 'ready' }));
        });

        device.on('error', (error) => {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: error.message,
          }));
        });

        device.on('incoming', (call) => {
          callRef.current = call;
          setState((prev) => ({
            ...prev,
            call,
            status: 'ringing',
          }));

          call.on('accept', () => {
            setState((prev) => ({ ...prev, status: 'in-call' }));
            startDurationTimer();
          });

          call.on('disconnect', () => {
            callRef.current = null;
            stopDurationTimer();
            setState((prev) => ({
              ...prev,
              call: null,
              status: 'ready',
              callDuration: 0,
              isMuted: false,
            }));
          });
        });

        await device.register();
        deviceRef.current = device;

        setState((prev) => ({
          ...prev,
          device,
          identity: data.identity,
          status: 'ready',
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error.message || 'Failed to initialize',
        }));
      }
    },
    [startDurationTimer, stopDurationTimer],
  );

  const makeCall = useCallback(
    async (to: string, params?: Record<string, string>) => {
      if (!deviceRef.current) {
        setState((prev) => ({ ...prev, error: 'Device not initialized' }));
        return;
      }

      try {
        setState((prev) => ({ ...prev, status: 'connecting' }));

        const call = await deviceRef.current.connect({
          params: { To: to, ...params },
        });

        callRef.current = call;

        call.on('accept', () => {
          setState((prev) => ({ ...prev, status: 'in-call', call }));
          startDurationTimer();
        });

        call.on('disconnect', () => {
          callRef.current = null;
          stopDurationTimer();
          setState((prev) => ({
            ...prev,
            call: null,
            status: 'ready',
            callDuration: 0,
            isMuted: false,
          }));
        });

        call.on('error', (error) => {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: error.message,
          }));
        });

        setState((prev) => ({ ...prev, call, status: 'ringing' }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error.message,
        }));
      }
    },
    [startDurationTimer, stopDurationTimer],
  );

  const endCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.disconnect();
      callRef.current = null;
      stopDurationTimer();
      setState((prev) => ({
        ...prev,
        call: null,
        status: 'ready',
        callDuration: 0,
        isMuted: false,
      }));
    }
  }, [stopDurationTimer]);

  const acceptIncoming = useCallback(() => {
    if (callRef.current && state.status === 'ringing') {
      callRef.current.accept();
    }
  }, [state.status]);

  const rejectIncoming = useCallback(() => {
    if (callRef.current && state.status === 'ringing') {
      callRef.current.reject();
      callRef.current = null;
      setState((prev) => ({ ...prev, call: null, status: 'ready' }));
    }
  }, [state.status]);

  const toggleMute = useCallback(() => {
    if (callRef.current) {
      const newMuted = !state.isMuted;
      callRef.current.mute(newMuted);
      setState((prev) => ({ ...prev, isMuted: newMuted }));
    }
  }, [state.isMuted]);

  const sendDigits = useCallback((digits: string) => {
    if (callRef.current) {
      callRef.current.sendDigits(digits);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopDurationTimer();
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, [stopDurationTimer]);

  return {
    ...state,
    initialize,
    makeCall,
    endCall,
    acceptIncoming,
    rejectIncoming,
    toggleMute,
    sendDigits,
  };
}
