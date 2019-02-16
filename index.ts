import * as jisco from "jisco";

import { token } from "./config";

new jisco.Client({
	commands: {
		permissionOverrides: ["210118905006522369"],
	},
	debug: "quiet",
	name: "SFE Quality Assurance",
	storageStrategy: jisco.StorageStrategies.MongooseStrategy({
		dbUri: "mongodb://sfeqa:sfeqa123@ds127545.mlab.com:27545/sfe-qa",
	}),
})
	.plugin(`${__dirname}/plugins/base.ts`, { path: true })
	.plugin(`${__dirname}/plugins/reports.ts`, { path: true })
	.start(token);
