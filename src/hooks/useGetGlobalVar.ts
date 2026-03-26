import { GlobalVarContext } from "@/contexts/GlobalContext";
import { useContext, useMemo } from "react";

export const useGetGlobalVar = (keyword: string): string | undefined => {
  const globalVars = useContext(GlobalVarContext);

  return useMemo(() => {
    return globalVars.find((item) => item.name === keyword)?.value;
  }, [globalVars, keyword]);
};
