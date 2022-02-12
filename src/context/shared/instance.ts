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
		const [suc, err] = pcall(() => {
			props.v.keys.forEach((val, index) => {
				if (val.t === "str") {
					instance[val.v as never] = props.v.vals[index].v as never;
				} else if (val.t === "key") {
					instance[val.v.sub(2) as never] = props.v.vals[index].v as never;
				} else {
					error("Invalid index type!");
				}
			});
		});
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
				print(constructedInstance.Name);
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
	name: "instance",
	exe: exe,
};
