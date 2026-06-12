export interface Setting {
  siteName: string;
  slogan: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface ContentBlock {
  type: string;
  text: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface Service {
  url: string;
  title: string;
  description: string;
  content: ContentBlock[];
  images: ImageAsset[];
  slug: string;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  serviceSlug?: string;
  description: string;
  location: string;
  images: ImageAsset[];
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
}

export interface CleanData {
  settings: Setting;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
}
