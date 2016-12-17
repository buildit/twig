export interface ChangeLog {
  message: String;
  user: String;
  timestamp: String;
}

export interface ChangeLogs {
  data: ChangeLog[];
}
