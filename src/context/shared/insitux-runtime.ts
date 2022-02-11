import { invoke } from "@rbxts/insitux";
import { Ctx, Ins, Val, ValOrErr } from "@rbxts/insitux/out/types";
import { HttpService } from "@rbxts/services";

function generateCtx(ctxArray: context[]): Ctx {
	const state = new Map<string, Val>();

	function get(key: string): ValOrErr {
		print(key);
		if (state.has(key) === undefined) {
			return { kind: "err", err: `"${key}" not found.` };
		}
		return { kind: "val", value: state.get(key)! };
	}

	function set(key: string, val: Val): string | undefined {
		state.set(key, val);
		return undefined;
	}

	function exe(name: string, args: Val[]): ValOrErr {
		const nullVal: Val = { t: "null", v: undefined };
		print(name);

		const dotIndex = name.find(".", 1, true);
		if (dotIndex !== undefined) {
			const libName = name.sub(1, dotIndex[0]! - 1);
			for (const i of ctxArray) {
				print(i.name, libName);
				if (i.name === libName) {
					const fnName = name.sub(dotIndex[1]! + 1);
					return i.exe(fnName, args);
				}
			}
		}

		return { kind: "val", value: nullVal };
	}

	return {
		exe: exe,
		get: get,
		set: set,
		print: print,
		env: { funcs: {}, vars: {} },
		functions: [],
		loopBudget: 1000,
		rangeBudget: 1000,
		callBudget: 1000,
		recurBudget: 1000,
	};
}

function runInsitux(src: string, context: Ctx) {
	print("running");
	invoke(context, src, HttpService.GenerateGUID(), true);
}

export type context = { name: string; exe: (name: string, args: Val[]) => ValOrErr };

export function getInsituxScripts(dir: Instance, contextDir: Instance) {
	const contextArray = [...contextDir.GetChildren(), ...script.Parent!.GetChildren()].mapFiltered((i) => {
		if (i.IsA("ModuleScript") && i.Name !== "insitux-runtime") {
			return require(i) as context;
		}

		return undefined;
	});

	const context = generateCtx(contextArray);

	dir.GetChildren().forEach((i) => {
		if (i.IsA("ModuleScript")) {
			runInsitux(require(i) as string, context);
		}
	});
}
