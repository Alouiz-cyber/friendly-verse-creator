
import { OrgContent } from '@/types';
import { api } from '@/utils/api';

// Mock data for organization content
let mockOrgContent: OrgContent[] = [
  {
    id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "OGEC - Œuvre Générale pour l'Éducation et la Culture",
    description: "Notre organisation se consacre à l'éducation et au développement culturel des enfants et des jeunes. Nous proposons diverses activités éducatives, culturelles et récréatives pour enrichir leur vie et favoriser leur épanouissement.",
    video_url: "/home-video.mp4",
    mission_statement: "Offrir un environnement éducatif et culturel qui favorise le développement personnel et l'épanouissement des jeunes dans notre communauté.",
    vision: "Devenir un pilier dans l'éducation et la culture, en formant des générations conscientes et actives dans la société.",
    history: "Fondée en 2010, notre organisation a commencé avec un petit groupe de bénévoles dévoués. Aujourd'hui, nous sommes fiers de servir des centaines d'enfants chaque année.",
    is_active: true
  }
];

export const getOrgContent = async (): Promise<OrgContent[]> => {
  try {
    // In a real implementation, this would be an API call
    // const response = await api.get('/api/org-content');
    // return response.data;
    
    return Promise.resolve(mockOrgContent);
  } catch (error) {
    console.error('Error fetching organization content:', error);
    return [];
  }
};

export const getActiveOrgContent = async (): Promise<OrgContent | null> => {
  try {
    const content = await getOrgContent();
    return content.find(item => item.is_active) || null;
  } catch (error) {
    console.error('Error fetching active organization content:', error);
    return null;
  }
};

export const updateOrgContent = async (id: number, data: Partial<OrgContent>): Promise<OrgContent | null> => {
  try {
    // In a real implementation, this would be an API call
    // const response = await api.put(`/api/org-content/${id}`, data);
    // return response.data;
    
    mockOrgContent = mockOrgContent.map(item => 
      item.id === id ? { ...item, ...data, updated_at: new Date().toISOString() } : item
    );
    
    return mockOrgContent.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error updating organization content:', error);
    return null;
  }
};

export const createOrgContent = async (data: Omit<OrgContent, 'id' | 'created_at' | 'updated_at'>): Promise<OrgContent | null> => {
  try {
    // In a real implementation, this would be an API call
    // const response = await api.post('/api/org-content', data);
    // return response.data;
    
    const newContent: OrgContent = {
      id: Math.max(0, ...mockOrgContent.map(c => c.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    };
    
    mockOrgContent.push(newContent);
    
    return newContent;
  } catch (error) {
    console.error('Error creating organization content:', error);
    return null;
  }
};
