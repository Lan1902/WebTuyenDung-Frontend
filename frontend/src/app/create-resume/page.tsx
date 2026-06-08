'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/lib/lang';
import { CreateResume, CreateResumeExperience, CreateResumeEducation, CreateResumeSkill, User } from '@/types';
import { resumeApi } from '@/lib/api';
import { withAuth } from '@/lib/auth';

interface ResumeExperienceFormProps {
  experience: CreateResumeExperience;
  index: number;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  t: (key: string) => string;
}

const ResumeExperienceForm: React.FC<ResumeExperienceFormProps> = ({ experience, index, onChange, onRemove, t }) => {
  return (
    <div className="border p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">{t('resume.experience')} #{index + 1}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.company')}</label>
          <input
            type="text"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.company')}
            value={experience.company}
            onChange={(e) => onChange(index, 'company', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.position')}</label>
          <input
            type="text"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.position')}
            value={experience.position}
            onChange={(e) => onChange(index, 'position', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.startDate')}</label>
          <input
            type="date"
            className="mt-1 block w-full input-field"
            value={experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(index, 'startDate', e.target.value ? new Date(e.target.value) : undefined)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.endDate')}</label>
          <input
            type="date"
            className="mt-1 block w-full input-field"
            value={experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(index, 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
            disabled={experience.isCurrent}
          />
        </div>
      </div>
      <div className="flex items-center mb-4">
        <input
          id={`current-${index}`}
          type="checkbox"
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={experience.isCurrent}
          onChange={(e) => onChange(index, 'isCurrent', e.target.checked)}
        />
        <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          {t('resume.currentlyWorking')}
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.description')}</label>
        <textarea
          rows={3}
          className="mt-1 block w-full input-field"
          placeholder={t('resume.bioPlaceholder')}
          value={experience.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
        ></textarea>
      </div>
      <button onClick={() => onRemove(index)} type="button" className="btn-outline-danger mt-4">
        {t('common.delete')} {t('resume.experience')}
      </button>
    </div>
  );
};

interface ResumeEducationFormProps {
  education: CreateResumeEducation;
  index: number;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  t: (key: string) => string;
}

const ResumeEducationForm: React.FC<ResumeEducationFormProps> = ({ education, index, onChange, onRemove, t }) => {
  return (
    <div className="border p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">{t('resume.education')} #{index + 1}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.school')}</label>
          <input
            type="text"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.school')}
            value={education.institution}
            onChange={(e) => onChange(index, 'institution', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.degree')}</label>
          <input
            type="text"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.degree')}
            value={education.degree}
            onChange={(e) => onChange(index, 'degree', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.fieldOfStudy')}</label>
          <input
            type="text"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.fieldOfStudy')}
            value={education.fieldOfStudy}
            onChange={(e) => onChange(index, 'fieldOfStudy', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.graduationYear')}</label>
          <input
            type="number"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.graduationYear')}
            value={education.graduationYear || ''}
            onChange={(e) => onChange(index, 'graduationYear', parseInt(e.target.value))}
          />
        </div>
      </div>
      <button onClick={() => onRemove(index)} type="button" className="btn-outline-danger mt-4">
        {t('common.delete')} {t('resume.education')}
      </button>
    </div>
  );
};

interface ResumeSkillFormProps {
  skill: CreateResumeSkill;
  index: number;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  t: (key: string) => string;
}

const ResumeSkillForm: React.FC<ResumeSkillFormProps> = ({ skill, index, onChange, onRemove, t }) => {
  const proficiencyLevels = [
    { value: 'Beginner', label: t('resume.beginner') },
    { value: 'Intermediate', label: t('resume.intermediate') },
    { value: 'Advanced', label: t('resume.advanced') },
    { value: 'Expert', label: t('resume.expert') },
  ];

  return (
    <div className="border p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">{t('resume.skills')} #{index + 1}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.skillName')}</label>
          <input
            type="text"
            className="mt-1 block w-full input-field"
            placeholder={t('resume.skillName')}
            value={skill.skillName}
            onChange={(e) => onChange(index, 'skillName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.proficiency')}</label>
          <select
            className="mt-1 block w-full input-field"
            value={skill.proficiency}
            onChange={(e) => onChange(index, 'proficiency', e.target.value)}
            required
          >
            {proficiencyLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={() => onRemove(index)} type="button" className="btn-outline-danger mt-4">
        {t('common.delete')} {t('resume.skills')}
      </button>
    </div>
  );
};

const CreateResumePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [resumeData, setResumeData] = useState<CreateResume>({
    title: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
    experiences: [],
    educations: [],
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Pre-fill personal info if available from user profile
      setResumeData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
      }));
    } else if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, user, router]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const updatedExperiences = resumeData.experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setResumeData(prev => ({ ...prev, experiences: updatedExperiences }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: '', position: '', isCurrent: false, description: '' },
      ],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    const updatedEducations = resumeData.educations.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setResumeData(prev => ({ ...prev, educations: updatedEducations }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        { institution: '', degree: '', fieldOfStudy: '', graduationYear: undefined },
      ],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const handleSkillChange = (index: number, field: string, value: any) => {
    const updatedSkills = resumeData.skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    setResumeData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleAddSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { skillName: '', proficiency: 'Beginner' }],
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await resumeApi.create(resumeData);
      if (response.status === 201) {
        setSuccess(t('resume.resumeCreatedSuccessfully'));
        router.push(`/resumes/${response.data.id}`); // Redirect to view resume page
      } else {
        setError(t('common.error') + ': ' + (response.data.message || t('common.error')));
      }
    } catch (err) {
      setError(t('common.error') + ': ' + (err as any).response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('resume.title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('resume.subtitle')}</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm dark:bg-green-900 dark:border-green-700 dark:text-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm dark:bg-rose-900 dark:border-rose-700 dark:text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {/* Personal Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('resume.personalInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.fullNamePlaceholder')}</label>
                <input
                  type="text"
                  name="fullName"
                  className="mt-1 block w-full input-field"
                  placeholder={t('resume.fullNamePlaceholder')}
                  value={resumeData.fullName}
                  onChange={handlePersonalChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.emailPlaceholder')}</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 block w-full input-field"
                  placeholder={t('resume.emailPlaceholder')}
                  value={resumeData.email}
                  onChange={handlePersonalChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.phonePlaceholder')}</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="mt-1 block w-full input-field"
                  placeholder={t('resume.phonePlaceholder')}
                  value={resumeData.phoneNumber}
                  onChange={handlePersonalChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.addressPlaceholder')}</label>
                <input
                  type="text"
                  name="address"
                  className="mt-1 block w-full input-field"
                  placeholder={t('resume.addressPlaceholder')}
                  value={resumeData.address}
                  onChange={handlePersonalChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('resume.bioPlaceholder')}</label>
              <textarea
                name="bio"
                rows={4}
                className="mt-1 block w-full input-field"
                placeholder={t('resume.bioPlaceholder')}
                value={resumeData.bio}
                onChange={handlePersonalChange}
              ></textarea>
            </div>
          </section>

          {/* Experience Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('resume.experience')}</h2>
            {resumeData.experiences.map((exp, index) => (
              <ResumeExperienceForm
                key={index}
                index={index}
                experience={exp}
                onChange={handleExperienceChange}
                onRemove={handleRemoveExperience}
                t={t}
              />
            ))}
            <button onClick={handleAddExperience} type="button" className="btn-secondary mt-4">
              {t('resume.addExperience')}
            </button>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('resume.education')}</h2>
            {resumeData.educations.map((edu, index) => (
              <ResumeEducationForm
                key={index}
                index={index}
                education={edu}
                onChange={handleEducationChange}
                onRemove={handleRemoveEducation}
                t={t}
              />
            ))}
            <button onClick={handleAddEducation} type="button" className="btn-secondary mt-4">
              {t('resume.addEducation')}
            </button>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('resume.skills')}</h2>
            {resumeData.skills.map((skill, index) => (
              <ResumeSkillForm
                key={index}
                index={index}
                skill={skill}
                onChange={handleSkillChange}
                onRemove={handleRemoveSkill}
                t={t}
              />
            ))}
            <button onClick={handleAddSkill} type="button" className="btn-secondary mt-4">
              {t('resume.addSkill')}
            </button>
          </section>

          <div className="flex justify-end gap-4">
            <button type="button" className="btn-outline dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('common.loading') : t('resume.createResume')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(CreateResumePage);