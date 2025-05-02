export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile_picture: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Anachid {
  id: number;
  title: string;
  audio_url: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Add the missing properties to the Program interface
export interface Program {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  // Add the missing properties that were causing TypeScript errors
  image_url?: string;
  location?: string;
  capacity?: number;
  details_url?: string;
}

export interface CarteTechnique {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  team_id: number;
  name: string;
  role: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enfant {
  id: number;
  name: string;
  age: number;
  date_of_birth: string;
  address: string;
  phone_number: string;
  parent_name: string;
  parent_phone_number: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Maladie {
  id: number;
  name: string;
  description: string;
  symptoms: string;
  treatment: string;
  created_at: string;
  updated_at: string;
}

export interface Hobby {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  enfant_id: number;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}
