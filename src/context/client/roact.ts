import { Val, ValOrErr } from "@rbxts/insitux/out/types";
import { context } from "context/shared/insitux-runtime";

function exe(name: string, args: Val[]): ValOrErr {
	const nullVal: Val = { t: "null", v: undefined };
	switch (name) {
		case "createElement": {
			print("Create value!");
			return { kind: "val", value: nullVal };
		}
	}
	return { kind: "val", value: nullVal };
}

export = {
	name: "$roact",
	exe: exe,
};
