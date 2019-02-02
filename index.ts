import * as jisco from "jisco";

import { token } from "./config";
import { base } from "./plugins/base";
import { reports } from "./plugins/reports";

new jisco.Client({
	commands: {
		permissionOverrides: ["210118905006522369"],
	},
	debug: "quiet",
	discord: {},
	name: "SFE Quality Assurance",
	storageStrategy: jisco.StorageStrategies.MongooseStrategy({
		dbUri: "mongodb://localhost:27017/sfeqa",
	}),
})
	.addPlugin(base)
	.addPlugin(reports)
	.start(token);
