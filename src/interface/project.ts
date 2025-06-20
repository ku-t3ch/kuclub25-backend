export interface ActivityHours {
  social_activities?: number;
  university_activities?: number;
  competency_development_activities?: {
    health?: number;
    virtue?: number;
    thinking_and_learning?: number;
    interpersonal_relationships_and_communication?: number;
  };
}

export interface ProjectParticipants {
  guest?: number;
  coreteam?: number;
}

export interface ScheduleDay {
  date: string;
  time: string[];
  description: string;
}

export interface Schedule {
  each_day: ScheduleDay[];
  location: string;
}

export interface OutsideKaset {
  district?: string;
  province?: string;
}

export interface Project {
  id: string;
  // Database field names
  date_start_the_project?: Date;
  date_end_the_project?: Date;
  project_location?: string;
  project_name_en?: string;
  project_name_th?: string;
  
  // Alternative field names (for compatibility)
  date_start?: Date;
  date_end?: Date;
  location?: string;
  name_en?: string;
  name_th?: string;
  
  // Organization info
  org_nickname?: string;
  org_name_en?: string;
  org_name_th?: string;
  organization_orgid: string; // Organization ID
  campus_name?: string;
  
  // Project details
  activity_hours: ActivityHours | string;
  activity_format: string[] | string; // รูปแบบกิจกรรม
  expected_project_outcome: string[] | string; // ผลลัพธ์ที่คาดหวัง
  schedule: Schedule | string; // ตารางเวลา
  outside_kaset: OutsideKaset | string | null; // ข้อมูลสถานที่นอก มก.
  
  // Project reasoning and objectives
  principles_and_reasoning?: string; 
  project_objectives?: string[] | string;
}