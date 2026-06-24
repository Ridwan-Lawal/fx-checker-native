import { api } from "@/lib/axios";
import { devLog } from "@/lib/services/rates";
import { RateType } from "@/utils/types";

export async function getCurrencies(): Promise<string[]> {
  try {
    const res = await api.get<RateType>("/latest");
    return ["EUR", ...Object.keys(res.data.rates)];
  } catch (error) {
    devLog(error);
    throw new Error(
      "Something went wrong getting currencies. Please try again.",
    );
  }
}
