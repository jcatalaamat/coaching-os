// Coach entity - represents the logged-in coaching professional
export interface Coach {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  timezone: string;
}

// Client status options
export type ClientStatus = 'active' | 'paused' | 'completed' | 'lead';

// Client entity - individuals being coached
export interface Client {
  id: string;
  coachId: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  status: ClientStatus;
  createdAt: Date;
}

// Program type options
export type ProgramType = '1:1' | 'group' | 'hybrid';

// Program entity - coaching packages/offerings
export interface Program {
  id: string;
  coachId: string;
  name: string;
  description: string;
  type: ProgramType;
  price: number;
  currency: string;
  numberOfSessions?: number;
}

// Session status options
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

// Session entity - individual coaching appointments
export interface Session {
  id: string;
  coachId: string;
  clientId: string;
  programId?: string;
  dateTime: Date;
  durationMinutes: number;
  status: SessionStatus;
  location: string;
}

// Note entity - session notes and observations
export interface Note {
  id: string;
  coachId: string;
  clientId: string;
  sessionId?: string;
  title?: string;
  content: string;
  createdAt: Date;
}
