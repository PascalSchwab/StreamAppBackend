type EventHandler<T> = (payload: T) => void;

export class EventBus<T extends Record<string, any>> {
  private handlers: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event]!.push(handler);
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    this.handlers[event] = (this.handlers[event] || []).filter(h => h !== handler);
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    (this.handlers[event] || []).forEach(handler => handler(payload));
  }
}