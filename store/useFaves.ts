import { Fave } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface FavesState {
  faves: Fave[];
  addFave: (fave: Fave) => void;
}

export const useFaveStore = create<FavesState>()(
  devtools(
    persist(
      (set) => ({
        faves: [],
        addFave: (fave: Fave) =>
          set((state) => {
            const existingFave = state.faves.find(
              (f) => f.currencyPair === fave.currencyPair,
            );

            if (existingFave) {
              return {
                faves: state.faves.filter(
                  (f) => f.currencyPair !== existingFave.currencyPair,
                ),
              };
            } else {
              return { faves: [fave, ...state.faves] };
            }
          }),
      }),
      { name: "fave-store", storage: createJSONStorage(() => AsyncStorage) },
    ),
    { name: "FavesStore" },
  ),
);

if (__DEV__) {
  useFaveStore.subscribe((state) => console.log(state.faves, "faves"));
  console.log(useFaveStore.getState().faves, "faves");
}
