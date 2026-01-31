// src/types/employee.ts

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type PunchFromGeofence =
  | "PUNCH_FROM_GEOFENCE"
  | "PUNCH_FROM_ANYWHERE";

export interface EmployeePayload {
  // Basic
  firstname: string;
  lastname?: string;
  password?: string;
  email?: string | null;
  employeeCode?: number;
  designation?: string;
  phoneNumber: string;
  Country?: string;
  salary?: number;
  birthDate?: Date;
  emergencyContactPhone?: string | null;
  emergencyContactName?: string | null;
  gender?: Gender | null;
  bloodGroup?: BloodGroup | null;

  // Settings
  weekOffExtraPayment: boolean;
  weekOffDay?: string | null;
  applicableToOvertime: boolean;
  shiftwiseAttendance: boolean;
  payrollConfiguration: string;
  numberOfCasualLeaves: number;
  numberOfSickLeaves: number;
  numberOfPrivilegeLeaves: number;
  numberOfEmergencyLeaves: number;
  addDocument?: any;
  multipleAttendance: boolean;
  liveTracking: boolean;
  mobileAttendance: boolean;
  aiFingerprintVerification: boolean;
  selfCustomDaywiseSalary: boolean;
  viewSelfSalary: boolean;
  selfOdometerReading: boolean;
  dateOfJoining: Date;
  punchFromGeofence: PunchFromGeofence;

  // Bank
  panNumber: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankName: string;
  bankBranchName: string;
  accountHolderName: string;
  address: string;
}
