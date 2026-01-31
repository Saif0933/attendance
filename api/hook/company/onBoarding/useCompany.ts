import { useMutation, useQuery } from "@tanstack/react-query";
import {
  onboardCompanyApi,
  getCompanyByIdApi,
  OnboardCompanyPayload,
  Company,
} from "../../company/onBoarding/company.api";

/* ---------- ONBOARD / UPDATE COMPANY ---------- */
export const useOnboardCompany = () => {
  return useMutation({
    mutationFn: (payload: OnboardCompanyPayload) =>
      onboardCompanyApi(payload),
  });
};

/* ---------- GET COMPANY BY ID ---------- */
export const useGetCompanyById = (id: number) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyByIdApi(id),
    enabled: !!id,
  });
};
