export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface ProfileProduct {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  isFavorite: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  icon: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  headline: string;
  role: string;
  businessName: string;
  bio: string;
  location: string;
  region: string;
  website: string;
  instagram: string;
  email: string;
  phoneNumber: string;
  followers: number;
  following: number;
  productsCount: number;
  rating: number;
  completionPercentage: number;
  isVerified: boolean;
  isOpenToWork: boolean;
  avatar: string;
  coverImage?: string;
  blockedUserIds: string[];
  experiences: Experience[];
  skills: Skill[];
  achievements: Achievement[];
  products: ProfileProduct[];
  timeline: TimelineEvent[];
  socialLinks: SocialLink[];
}
