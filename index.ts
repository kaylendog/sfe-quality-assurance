import * as jisco from "jisco";

import { token } from "./config";

new jisco.Client({
	commands: {},
	debug: "quiet",
	discord: {},
	name: "sfe-qa",
	storageStrategy: jisco.StorageStrategies.MongooseStrategy({
		dbUri: "mongodb://localhost:27017/sfeqa",
	}),
}).start(token);
