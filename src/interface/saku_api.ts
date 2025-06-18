export interface APIProject {
  id: string;
  date_start_the_project: string | null;
  date_end_the_project: string | null;
  project_location: string | null;
  project_name_en: string | null;
  project_name_th: string;
  activity_hours: string | ActivityHours | null;
  activity_format: string | string[] | null;
  expected_project_outcome: string | string[] | null;
  schedule: string | Schedule | null;
  organization_orgid: string;
  outside_kaset: string | OutsideKaset | null;
  principles_and_reasoning: string | null;
  project_objectives: string | string[] | null;
  Organization?: {
    orgnameen: string | null;
    orgnameth: string;
    org_nickname: string | null;
    campus: {
      name: string;
    } | null;
  };
}

export interface APIOrganization {
  id: string;
  orgnameen: string | null;
  orgnameth: string;
  organizationMark: string | null;
  org_image: string | null;
  description: string | null;
  instagram: string | null;
  facebook: string | null;
  views: number;
  org_nickname: string | null;
  org_type: {
    name: string;
  } | null;
  campus: {
    name: string;
  } | null;
}

export interface APICampus {
  name: string;
}

export interface APIOrganizationType {
  name: string;
}
export interface ActivityHours {
  [key: string]: any;
}

export interface Schedule {
  [key: string]: any;
}

export interface OutsideKaset {
  [key: string]: any;
}

export interface KUClubAPIResponse {
  projects: APIProject[];
  organizations: APIOrganization[];
  campuses: APICampus[];
  organizationsType: APIOrganizationType[];
}