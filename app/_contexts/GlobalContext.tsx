import { GlobalVariable } from "@/types/types";
import { getGlobalVariables } from "@/utils/supabase/global_variables";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

export const GlobalVarContext = createContext<GlobalVariable[]>([]);

export function GlobalVarProvider({ children }: PropsWithChildren) {
	const [globalVariables, setGlobalVariables] = useState<GlobalVariable[]>([]);

	useEffect(() => {
		const fetchGlobalVariables = async () => {
			const data = await getGlobalVariables();
			setGlobalVariables(data);
		};

		fetchGlobalVariables();
	}, []);

	return (
		<GlobalVarContext.Provider value={globalVariables}>
			{children}
		</GlobalVarContext.Provider>
	);
}
