import { Plugin, RichEmbed } from "jisco";
import { err } from "../util/Util";

interface IReportsPluginConfig {
	issuesToConfirm: {
		id: number;
		submittedBy: string;
		submittedAt: number;
		message: string;
	}[];
	increment: number;
}

export const reports = new Plugin({
	name: "reports",
	onStart: async (p) => {
		if (!p.config || !p.config.issuesToConfirm) {
			p.config = {
				issuesToConfirm: [],
				increment: 0,
			} as IReportsPluginConfig;
		}

		p.command("submit", 0, "<message:string...>", (c, m, a) => {
			p.config.issuesToConfirm.push({
				submittedBy: m.author.id,
				submittedAt: Date.now(),
				message: a.join(" "),
				id: p.config.increment,
			});

			m.channel.send(
				new RichEmbed(c)
					.setTitle("Report Sumitted")
					.setDescription(
						"You have successfully submitted a report. Give us a moment, and we'll get back to you as soon as you can.",
					)
					.addField("Report ID", p.config.increment),
			);
			p.config.increment += 1;
		});

		p.command("reports", 0, "[id:number]", (c, m, a) => {
			if (a[0]) {
				let report = (p.config as IReportsPluginConfig).issuesToConfirm.find(
					(v) => v.id === a[0],
				);
				if (!report) {
					return m.reply(
						err(`Could not find report ID \`${a[0]}\`.`),
					);
				}
				m.channel.send(
					new RichEmbed(c)
						.setTitle(`Report ${report.id}`)
						.setDescription(
							`Submitted by: <@${report.id}> (\`${report.id}\`)
                            Submitted at: \`${new Date(report.submittedAt)}\`
                            `,
						)
						.addField("Content", `\`\`\`${report.message}\`\`\``),
				);
			}
		});
		return true;
	},
});
