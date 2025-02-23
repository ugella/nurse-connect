export interface DateRange {
  from: Date;
  to: Date;
}

export interface Nurse {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  isVerified: boolean;
  availability: string;
  specialties: string[];
}

export interface Booking {
  id: string;
  nurseId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  serviceType: string;
  totalAmount: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  nurseId: string;
  clientId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "nurse" | "admin";
  createdAt: Date;
}
