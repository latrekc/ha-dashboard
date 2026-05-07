export enum DeviceType {
  Plant = "plant",
  MotionSensor = "motion_sensor",
  TempHumiditySensor = "temp_humidity_sensor",
  DoorSensor = "door_sensor",
  UPS = "ups",
  ButtonSwitch = "button_switch",
  Unknown = "unknown",
}

export type BatteryDeviceRef = {
  device_id: string;

  // Device (name, tags/labels)
  name: string;
  labels: string[]; // "tags/labels" (HA calls them labels)

  type: DeviceType;

  // Battery entity
  battery_entity_id: string;

  // Area
  area_id?: string;
  area_name?: string;
};

export type BatteryDashboardCardConfig = {
  type: "custom:ha-battery-dashboard-card";
  title?: string;
  columns?: number;

  // Provided by the strategy
  devices: BatteryDeviceRef[];

  // Graph window
  start_ts: string; // ISO timestamp
  end_ts: string;   // ISO timestamp
};