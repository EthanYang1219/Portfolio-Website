export type ProjectType = 'code' | 'phone' | 'plot' | 'image' | 'doc';

export interface ProjectDetail {
  overview: string;
  role: string;
  challenges: string;
  highlights: string[];
}

export interface Project {
  id: string;
  title: string;
  meta: string;
  url: string;
  description: string;
  gradient: string;
  type: ProjectType;
  details?: ProjectDetail;
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  when: string;
  desc: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  symbolId: string;
}
