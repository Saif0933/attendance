// src/api/decision.api.ts
import { api } from "../../../api/api";
import {
  ApprovalStatus,
  Decision,
  DecisionFilters,
  DecisionStatus,
  PaginatedDecisionResponse,
} from "../type/decision";

// ✅ Get All (Pagination)
export const getAllDecisionsApi = async (
  companyId: string,
  filters: DecisionFilters
): Promise<PaginatedDecisionResponse> => {
  const { data } = await api.get(`/decision/all/${companyId}`, {
    params: filters,
  });

  return data.data; // because SuccessResponse wraps inside { data }
};

// ✅ Get By ID
export const getDecisionByIdApi = async (id: string): Promise<Decision> => {
  const { data } = await api.get(`/decision/${id}`);
  return data.data;
};

// ✅ Create
export const createDecisionApi = async ({
  companyId,
  payload,
}: {
  companyId: string;
  payload: {
    title: string;
    description?: string;
    participantIds?: string[];
  };
}) => {
  const { data } = await api.post(`/decision/create/${companyId}`, payload);
  return data.data;
};

// ✅ Update
export const updateDecisionApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: {
    title?: string;
    description?: string;
    status?: DecisionStatus;
  };
}) => {
  const { data } = await api.put(`/decision/${id}`, payload);
  return data.data;
};

// ✅ Participant Approval
export const participantApprovalApi = async ({
  id,
  status,
  comment,
}: {
  id: string;
  status: ApprovalStatus;
  comment?: string;
}) => {
  const { data } = await api.post(`/decision/${id}/approve`, {
    status,
    comment,
  });
  return data.data || data;
};

// ✅ Company Approval
export const companyApprovalApi = async ({
  id,
  status,
}: {
  id: string;
  status: ApprovalStatus;
}) => {
  const { data } = await api.post(`/decision/${id}/company-approve`, {
    status,
  });
  return data.data || data;
};

// ✅ Delete
export const deleteDecisionApi = async (id: string) => {
  const { data } = await api.delete(`/decision/${id}`);
  return data.data || data;
};
