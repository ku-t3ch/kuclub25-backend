import { ActivityHours, Schedule, OutsideKaset } from "../interface/project";

export const parseActivityHours = (activityHours: string | ActivityHours): ActivityHours => {
  if (typeof activityHours === 'string') {
    try {
      return JSON.parse(activityHours);
    } catch (error) {
      console.error('Error parsing activity hours:', error);
      return {};
    }
  }
  return activityHours || {};
};

export const parseActivityFormat = (format: string | string[]): string[] => {
  if (typeof format === 'string') {
    try {
      const parsed = JSON.parse(format);
      return Array.isArray(parsed) ? parsed : [format];
    } catch (error) {
      return format.split(',').map(item => item.trim());
    }
  }
  return Array.isArray(format) ? format : [];
};

export const parseExpectedOutcome = (outcome: string | string[]): string[] => {
  if (typeof outcome === 'string') {
    try {
      const parsed = JSON.parse(outcome);
      return Array.isArray(parsed) ? parsed : [outcome];
    } catch (error) {
      return [outcome];
    }
  }
  return Array.isArray(outcome) ? outcome : [];
};

export const parseProjectObjectives = (objectives: string | string[]): string[] => {
  if (typeof objectives === 'string') {
    try {
      const parsed = JSON.parse(objectives);
      return Array.isArray(parsed) ? parsed : [objectives];
    } catch (error) {
      return objectives.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
  }
  return Array.isArray(objectives) ? objectives : [];
};

export const parseSchedule = (schedule: string | Schedule): Schedule | null => {
  if (typeof schedule === 'string') {
    try {
      return JSON.parse(schedule);
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return null;
    }
  }
  return schedule || null;
};

export const parseOutsideKaset = (outside: string | OutsideKaset | null): OutsideKaset | null => {
  if (typeof outside === 'string') {
    if (outside === 'null' || outside === '' || outside === 'undefined') return null;
    try {
      return JSON.parse(outside);
    } catch (error) {
      console.error('Error parsing outside kaset:', error);
      return null;
    }
  }
  return outside;
};

export const transformProjectData = (project: any) => {
  const parsedHours = parseActivityHours(project.activity_hours);
  const parsedFormat = parseActivityFormat(project.activity_format);
  const parsedOutcome = parseExpectedOutcome(project.expected_project_outcome);
  const parsedObjectives = parseProjectObjectives(project.project_objectives);
  const parsedSchedule = parseSchedule(project.schedule);
  const parsedOutsideKaset = parseOutsideKaset(project.outside_kaset);
  
  return {
    id: project.id,
    date_start: project.date_start,
    date_end: project.date_end,
    location: project.location,
    name_en: project.name_en,
    name_th: project.name_th,
    org_nickname: project.org_nickname,
    org_name_en: project.org_name_en || project.orgnameen,
    org_name_th: project.org_name_th || project.orgnameth,
    activity_hours: parsedHours,
    activity_format: parsedFormat,
    expected_project_outcome: parsedOutcome,
    schedule: parsedSchedule,
    organization_orgid: project.organization_orgid,
    outside_kaset: parsedOutsideKaset,
    principal_reasoning: project.principal_reasoning,
    project_objectives: parsedObjectives,
    created_at: project.created_at,
    updated_at: project.updated_at
  };
};