import { Log } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LogStoreType {
  logs: Log[];
  addLog: (log: Log) => void;
}

export const useLogStore = create<LogStoreType>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log: Log) =>
        set((state) => {
          const isLogExist = state.logs.some((l) => l.id);

          if (isLogExist) {
            return state;
          }

          return { logs: [log, ...state.logs] };
        }),
    }),
    { name: "logs-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);

if (__DEV__) {
  useLogStore.subscribe((state) => console.log(state.logs, "logs"));
}
