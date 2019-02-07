import { Plugin, RichEmbed } from "jisco";
import { toHHMMSS, err, check } from "../util/Util";
import { Message } from "discord.js";

export const base = new Plugin({
	name: "base",
	onStart: async (p) => {
		p.client.disgd.user.setActivity("SFE QA | !help", { type: "WATCHING" });
		p.on("resume", () =>
			p.client.disgd.user.setActivity("SFE QA | !help", {
				type: "WATCHING",
			}),
		);

		p.client.on(
			"command",
			(data: { command: string; message: Message }) => {
				data.message.delete();
			},
		);

		p.command("status", 0, "", (c, m, a) => {
			return m.channel.send(
				new RichEmbed(c)
					.setTitle("SFE QA - Status")
					.setDescription(
						`Uptime: \`${toHHMMSS(process.uptime().toString())}\``,
					),
			);
		});

		p.command("source", 0, "", async (c, m, a) => {
			return m.reply(
				"We are open source! You can find the repo here: https://github.com/actuallyori/sfe-quality-assurance/",
			);
		});

		p.command("bug", 0, "", async (c, m, a) => {
			return m.reply(
				"Submit issues at https://github.com/actuallyori/sfe-quality-assurance/issues",
			);
		});

		p.command("staff", 10, "<user:snowflake>", (c, m, a) => {
			if (!m.guild.members.get(a[0])) {
				return m.reply(err(`Could not find user \`${a[0]}\`.`));
			} else {
				return m.reply(
					check(`Added <@${a[0]}> (\`${a[0]}\`) to the staff team.`),
				);
			}
		});

		p.command("clear", 0, "[limit:number]", async (c, m, a) => {
			let toDelete = (await m.channel.fetchMessages({
				limit: a[0],
			})).filter((v) => !v.pinned);

			m.channel.bulkDelete(toDelete).then(
				() => {
					m.reply(check(`Deleted ${toDelete.size} messages.`));
				},
				(er) => {
					console.error(err);
					m.reply(err("Could not delete messages."));
				},
			);
		});

		return true;
	},
});
