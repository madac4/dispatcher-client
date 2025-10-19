import { io, Socket } from 'socket.io-client';
import { NotificationDTO } from '../models/notification.model';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected for notifications');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.emit('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('error', error);
    });

    // Listen for real-time notifications
    this.socket.on('notification', (notification: NotificationDTO) => {
      console.log('Received notification:', notification);
      this.emit('notification', notification);
    });

    // Listen for order updates
    this.socket.on('order-updated', (data: { orderId: string; update: unknown; timestamp: Date }) => {
      console.log('Order updated:', data);
      this.emit('order-updated', data);
    });

    // Listen for new messages
    this.socket.on('new-message', (data: { orderId: string; message: unknown; timestamp: Date }) => {
      console.log('New message:', data);
      this.emit('new-message', data);
    });
  }

  // Event emitter functionality
  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: unknown[]) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args));
    }
  }

  // Join order room for real-time updates
  joinOrderRoom(orderId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-order-room', orderId);
    }
  }

  // Leave order room
  leaveOrderRoom(orderId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-order-room', orderId);
    }
  }

  // Send typing indicators
  startTyping(orderId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing-start', orderId);
    }
  }

  stopTyping(orderId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing-stop', orderId);
    }
  }

  // Mark message as read
  markMessageAsRead(orderId: string) {
    if (this.socket?.connected) {
      this.socket.emit('mark-read', orderId);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
