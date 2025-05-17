
import { ReactNode } from "react";

export interface BlogPost {
  id: string;
  category: string;
  categorySlug: string;
  icon: ReactNode;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  coach?: {
    id: string;
    name: string;
    expertise: string;
    profileImage?: string;
  };
}

export interface CoachProfile {
  id: string;
  fullName: string;
  expertise: string;
  bio?: string;
  experienceYears?: number;
  profileImage?: string;
}

export interface FitnessPlan {
  id: string;
  coachId: string;
  title: string;
  description: string;
  price: number;
  durationWeeks: number;
  type: 'workout' | 'nutrition' | 'supplement';
  imageUrl?: string;
}

export interface CoachApplication {
  fullName: string;
  email: string;
  phone?: string;
  expertise: string;
  experienceYears: number;
  message?: string;
  resumeFile?: File;
}
