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
		dbUri: "mongodb://sfeqa:sfeqa123@ds127545.mlab.com:27545/sfe-qa",
	}),
})
	.addPlugin(base)
	.addPlugin(reports)
	.start(token);
