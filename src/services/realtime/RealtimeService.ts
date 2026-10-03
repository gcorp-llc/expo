import { AppState, AppStateStatus } from 'react-native';
import { RealtimeConnectionState, RealtimeFrame } from '@cardiani/types';

type EventCallback<T = any> = (payload: T) => void;

export class RealtimeService {
  private static instance: RealtimeService;
  private ws: WebSocket | null = null;
  private state: RealtimeConnectionState = 'Disconnected';
  private url: string;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private heartbeatInterval: any = null;
  private heartbeatTimeout: any = null;

  private stateListeners: Set<(state: RealtimeConnectionState) => void> = new Set();
  private subscribers: Map<string, Set<EventCallback>> = new Map();

  private constructor(url = 'ws://10.0.2.2:4400/api/chat/ws/v1') {
    this.url = url;
    this.setupLifecycleListeners();
  }

  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  public onStateChange(listener: (state: RealtimeConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private updateState(newState: RealtimeConnectionState) {
    this.state = newState;
    console.log(`[RealtimeService] Connection state transitioned to: ${newState}`);
    this.stateListeners.forEach((listener) => listener(newState));
  }

  public connect(token: string) {
    this.token = token;
    if (this.state === 'Ready' || this.state === 'Connecting') return;

    this.updateState('Connecting');
    try {
      this.ws = new WebSocket(`${this.url}?token=${encodeURIComponent(token)}`);
      this.setupEventHandlers();
    } catch (err) {
      console.error('[RealtimeService] Connection failed:', err);
      this.handleFailure();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.updateState('Connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const frame: RealtimeFrame = JSON.parse(event.data);
        console.log(`[RealtimeService] Frame received: ${frame.event}`);

        // Reset heartbeat timeout
        this.resetHeartbeatTimeout();

        if (frame.event === 'connection.ready') {
          this.updateState('Ready');
        }

        // Emit to local feature listeners
        this.emit(frame.event, frame.payload);
      } catch (err) {
        console.warn('[RealtimeService] Error parsing socket frame:', err);
      }
    };

    this.ws.onerror = (err) => {
      console.error('[RealtimeService] Socket error:', err);
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      if (this.state !== 'Disconnected') {
        this.handleFailure();
      }
    };
  }

  public send<T = any>(event: string, payload: T) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn(`[RealtimeService] Cannot send event ${event}, connection not open.`);
      return;
    }

    const frame: RealtimeFrame<T> = {
      event,
      version: 'v1',
      timestamp: new Date().toISOString(),
      request_id: Math.random().toString(36).substring(2, 11),
      user_id: '',
      payload,
    };

    this.ws.send(JSON.stringify(frame));
  }

  public subscribe<T = any>(event: string, callback: EventCallback<T>): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(callback);

    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(event);
        }
      }
    };
  }

  private emit(event: string, payload: any) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(payload));
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.send('heartbeat', { status: 'ping' });
    }, 25000);
    this.resetHeartbeatTimeout();
  }

  private resetHeartbeatTimeout() {
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    this.heartbeatTimeout = setTimeout(() => {
      console.warn('[RealtimeService] Heartbeat timeout. Reconnecting...');
      this.disconnect();
      this.handleFailure();
    }, 35000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
  }

  private handleFailure() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.updateState('Reconnecting');
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000, 30000);
      console.log(`[RealtimeService] Reconnecting in ${Math.round(delay)}ms...`);
      setTimeout(() => {
        if (this.token) this.connect(this.token);
      }, delay);
    } else {
      this.updateState('Failed');
    }
  }

  public disconnect() {
    this.updateState('Disconnected');
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // ─── Mobile Lifecycle Management ─────────────────────────────────────────
  private setupLifecycleListeners() {
    AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      console.log(`[RealtimeService] Mobile AppState change: ${nextAppState}`);
      if (nextAppState === 'active') {
        // App is foregrounded - Reconnect or update presence to online
        if (this.token) {
          console.log('[RealtimeService] App in foreground. Resuming connection...');
          this.connect(this.token);
          this.send('presence.update', { status: 'online' });
        }
      } else if (nextAppState === 'background') {
        // App is backgrounded - Update presence to offline or away to conserve battery
        console.log('[RealtimeService] App in background. Updating presence to away...');
        this.send('presence.update', { status: 'away' });
      }
    });
  }
}

export const realtimeService = RealtimeService.getInstance();
