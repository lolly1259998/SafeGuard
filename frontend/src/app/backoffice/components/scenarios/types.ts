export interface SecurityScenario {
  id: number;
  name: string;
  user: number;  // FK ID
  apply_to_all_cameras: boolean;
  cameras: number[];  // ManyToMany IDs
  control_center: number | null;
  event_types: string[];
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[];
  alert_email: boolean;
  alert_sms: boolean;
  save_recording: boolean;
  priority: string;
  is_active: boolean;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
  user_name: string;  // Serializer read-only
  control_center_name: string | null;  // Serializer read-only
  camera_names: string[];  // Serializer read-only
  preview: string;  // Serializer method
}

export interface ScenarioForm {
  name: string;
  apply_to_all_cameras: boolean;
  cameras: number[];
  control_center: number | null;
  event_types: string[];
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[];
  alert_email: boolean;
  alert_sms: boolean;
  save_recording: boolean;
  priority: string;
  is_active: boolean;
  is_manual: boolean;
}