import { Val, ValOrErr } from "@rbxts/insitux/out/types";
import { context } from "context/shared/insitux-runtime";

function attemptConstructInstance(ins: string): Instance | undefined {
	const [suc, instance] = pcall(() => {
		return new Instance(ins as keyof CreatableInstances);
	});

	if (suc) {
		if (!typeIs(instance, "string")) {
			return instance;
		}
	}
}

function applyProperties(instance: Instance, props: Val) {
	if (props.t === "dict") {
		print(props.v);
	}
}

function constructInstance(args: Val[]): Instance | undefined {
	const [instance, props] = args;
	print(instance, props);
	if (instance) {
		if (instance.t === "str") {
			const constructedInstance = attemptConstructInstance(instance.v);
			if (constructedInstance) {
				if (props) {
					applyProperties(constructedInstance, props);
				}

				return constructedInstance;
			}
		}
	}
}

function exe(name: string, args: Val[]): ValOrErr {
	const nullVal: Val = { t: "null", v: undefined };
	print("exe");
	switch (name) {
		case "new": {
			constructInstance(args);
			return { kind: "val", value: nullVal };
		}
	}
	return { kind: "val", value: nullVal };
}

export = {
	name: "$instance",
	exe: exe,
};
