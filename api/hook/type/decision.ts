// src/types/decision.ts

export type DecisionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface DecisionParticipant {
  id: string;
  status: ApprovalStatus;
  comment?: string;
  employee: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

export interface Decision {
  id: string;
  title: string;
  description?: string;
  status: DecisionStatus;
  companyApproval?: ApprovalStatus;
  createdAt: string;
  creator?: {
    id: string;
    firstname: string;
    lastname: string;
  };
  participants: DecisionParticipant[];
}

export interface DecisionMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedDecisionResponse {
  decisions: Decision[];
  meta: DecisionMeta;
}

export interface DecisionFilters {
  page?: number;
  limit?: number;
  status?: DecisionStatus;
  creatorId?: string;
  startDate?: string;
  endDate?: string;
}
