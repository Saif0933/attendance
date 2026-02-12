// src/hooks/useDecision.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  companyApprovalApi,
  createDecisionApi,
  deleteDecisionApi,
  getAllDecisionsApi,
  getDecisionByIdApi,
  participantApprovalApi,
  updateDecisionApi,
} from "../../hook/decision/decision.api";
import { DecisionFilters } from "../../hook/type/decision";

const queryKey = "decisions";

// ✅ GET ALL WITH PAGINATION
export const useGetAllDecisions = (companyId: string, filters: DecisionFilters) => {
  const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);

  return useQuery({
    queryKey: [queryKey, companyId, cleanFilters],
    queryFn: () => getAllDecisionsApi(companyId, cleanFilters),
    enabled: !!companyId,
    placeholderData: (previousData) => previousData, // smooth pagination
  });
};

// ✅ GET BY ID
export const useGetDecisionById = (id: string) => {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getDecisionByIdApi(id),
    enabled: !!id,
  });
};

// ✅ CREATE
export const useCreateDecision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createDecisionApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ✅ UPDATE
export const useUpdateDecision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateDecisionApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ✅ PARTICIPANT APPROVAL
export const useParticipantApproval = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: participantApprovalApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ✅ COMPANY APPROVAL
export const useCompanyApproval = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: companyApprovalApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ✅ DELETE
export const useDeleteDecision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteDecisionApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
