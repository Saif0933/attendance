import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showError } from "../../../../src/utils/meesage";
import {
  getCompanyByIdApi,
  onboardCompanyApi,
  OnboardCompanyPayload
} from "../../company/onBoarding/company.api";

/* ---------- ONBOARD / UPDATE COMPANY ---------- */
export const useOnboardCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OnboardCompanyPayload) =>
      onboardCompanyApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError(error){
      showError(error)
    }
  });
};

/* ---------- GET COMPANY BY ID ---------- */
export const useGetCompanyById = (id: string | number) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyByIdApi(id),
    enabled: !!id,
  });
};
