// Types for recruitment platform - matches backend DTOs

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'employer' | 'candidate';
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  companyId: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: string;
  experienceLevel: string;
  skillsRequired: string[];
  applicationsCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateJobPosting {
  title: string;
  description: string;
  companyId: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: string;
  experienceLevel: string;
  skillsRequired: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  resumeUrl: string;
  coverLetter: string;
  status: string;
  appliedAt: string;
}

export interface UpdateApplicationStatus {
  status: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  location: string;
}

// Resume-related types
export interface Resume {
  id: string;
  userId: string;
  title: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  experiences: ResumeExperience[];
  educations: ResumeEducation[];
  skills: ResumeSkill[];
}

export interface CreateResume {
  title: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  experiences: CreateResumeExperience[];
  educations: CreateResumeEducation[];
  skills: CreateResumeSkill[];
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface CreateResumeExperience {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  graduationYear?: number;
}

export interface CreateResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  graduationYear?: number;
}

export interface ResumeSkill {
  id: string;
  skillName: string;
  proficiency: string;
}

export interface CreateResumeSkill {
  skillName: string;
  proficiency: string;
}
