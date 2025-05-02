
import { BaseEntity } from '@/types';

export interface CarteTechnique extends BaseEntity {
  title: string;
  content: string;
  category: string;
  author_id: number;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  
  // Adding fields from your database schema
  name_nachat?: string;
  type_nachat?: string;
  sujet_nachat?: string;
  goals_nachat?: string;
  fi2a_mostahdafa?: string;
  gender?: string;
  '3adad_monkharitin'?: number;
  lieu?: string;
  time?: string;
  hajyat?: string;
  tari9a?: string;
}
