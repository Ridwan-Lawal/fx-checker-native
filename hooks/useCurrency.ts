import { getCurrencies } from "@/lib/services/currencies";
import { useQuery } from "@tanstack/react-query";

export function useGetCurrencies() {
  const {
    data: currenciesData,
    isPending: isFetchingCurrencies,
    error,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    staleTime: 1000 * 60 * 60,
    retry: 3,
  });

  return { currenciesData, isFetchingCurrencies, error };
}
