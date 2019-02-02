import { Plugin, RichEmbed } from "jisco";
import { err, check } from "../util/Util";
import { StringType } from "jisco/dist/types/StringType";
import { TextChannel, Message, GuildMember } from "discord.js";

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
		if (!p.config || !p.config.issuesToConfirm || !p.config.openIssues) {
			p.config = {
				issuesToConfirm: [],
				openIssues: [],
				increment: 0,
			} as IReportsPluginConfig;
		}

		p.command(
			"submit",
			0,
			[
				new StringType({
					argName: "message",
					required: true,
					rest: true,
				}),
			],
			async (c, m, a) => {
				if (m.guild.id !== "539055206638419988") {
					return m.reply(
						err(
							"This command has been set up for the SFE QA server. It needs tweaking in order to be run here.",
						),
					);
				}
				m.channel.send(
					new RichEmbed(c)
						.setTitle("Report Sumitted")
						.setDescription(
							"You have successfully submitted a report. Give us a moment, and we'll get back to you as soon as you can.",
						)
						.addField("Report ID", p.config.increment),
				);

				const reportMessage = (await (m.guild.channels.get(
					"541187775442190336",
				) as TextChannel).send(
					new RichEmbed(c)
						.setTitle(`Report from ${m.author.tag}`)
						.setDescription(
							`**This report is awaiting confirmation.**
                            Submitted by: ${m.author} (\`${m.author.id}\`)
                            Submitted at: \`${new Date()}\`
                            `,
						)
						.addField("Content", `\`\`\`${a.join(" ")}\`\`\``),
				)) as Message;

				reportMessage.react("✅");
				reportMessage.react("❎");

				p.config.issuesToConfirm.push({
					submittedBy: m.author.id,
					submittedAt: Date.now(),
					message: a.join(" "),
					embedId: reportMessage.id,
					id: p.config.increment,
				});

				reportMessage
					.createReactionCollector(
						(v, u) =>
							(v.emoji.name == "✅" || v.emoji.name == "❎") &&
							u.id !== p.client.disgd.user.id,
					)
					.on("collect", async (r) => {
						const iterator = (await r.fetchUsers())
							.filter((v) =>
								(m.guild.members.get(
									v.id,
								) as GuildMember).roles.find(
									(v) => v.name !== "QA Team",
								)
									? true
									: false,
							)
							.map((u) => {
								r.remove(u);
							});

						await Promise.all(iterator);

						if (
							r.users.filter((v) =>
								(m.guild.members.get(
									v.id,
								) as GuildMember).roles.find(
									(v) => v.name === "QA Team",
								)
									? true
									: false,
							)
						) {
							const openReportChannel = m.guild.channels.get(
								"541188021379137561",
							) as TextChannel;

							const submissionsChannel = m.guild.channels.get(
								"541187775442190336",
							) as TextChannel;
							switch (r.emoji.name) {
								case "✅": {
									submissionsChannel.send(
										check(
											`Report ID \`${
												p.config.increment
											}\` was approved.`,
										),
									);

									reportMessage.delete();

									openReportChannel.send(
										new RichEmbed(c)
											.setTitle(
												`Report from ${m.author.tag}`,
											)
											.setDescription(
												`Submitted by: ${m.author} (\`${
													m.author.id
												}\`)
                            Submitted at: \`${new Date()}\`
                            `,
											)
											.addField(
												"Content",
												`\`\`\`${a.join(" ")}\`\`\``,
											)
											.setFooter(`Approved at`),
									);

									let issue = p.config.issuesToConfirm.find(
										(v) => v.id === p.config.increment,
									);

									p.config.issuesToConfirm.splice(
										p.config.issuesToConfirm.indexOf(issue),
										1,
									);

									p.config.openIssues.push(issue);

									m.author.send(
										"**Congrats!** Your report has been accepted, and you can find it in <#539112344958271498>. Thanks for helping to keep SFE a better place.",
									);

									break;
								}
								case "❎": {
									submissionsChannel.send(
										check(
											`Report ID \`${
												p.config.increment
											}\` was denied.`,
										),
									);

									reportMessage.delete();

									let issue = p.config.issuesToConfirm.find(
										(v) => v.id === p.config.increment,
									);
									p.config.issuesToConfirm.splice(
										p.config.issuesToConfirm.indexOf(issue),
										1,
									);

									break;
								}
							}
						}
					});

				p.config.increment += 1;
			},
		);

		p.command(
			"reports.deny",
			10,
			"<id:number> <reason:string...>",
			(c, m, a) => {},
		);

		p.command("reports", 10, "[id:number]", (c, m, a) => {
			console.log(a[0]);
			if (a[0]) {
				let report = (p.config as IReportsPluginConfig).issuesToConfirm.find(
					(v) => v.id === a[0],
				);
				if (!report) {
					return m.reply(
						err(`Could not find report ID \`${a[0]}\`.`),
					);
				}
				return m.channel.send(
					new RichEmbed(c)
						.setTitle(`Report ${report.id}`)
						.setDescription(
							`Submitted by: <@${report.submittedBy}> (\`${
								report.submittedBy
							}\`)
                            Submitted at: \`${new Date(report.submittedAt)}\`
                            `,
						)
						.addField("Content", `\`\`\`${report.message}\`\`\``),
				);
			} else {
				const requireConfirmation = p.config.issuesToConfirm.map(
					(v) =>
						`${v.id} - <@${v.submittedBy}> (\`${
							v.submittedBy
						}\`) - \`${new Date(v.submittedAt)}\``,
				);

				return m.channel.send(
					new RichEmbed(c)
						.setTitle("Report List")
						.setDescription("Here is a list of all open reports.")
						.addField(
							"Requiring Confirmation",
							requireConfirmation.length > 0
								? requireConfirmation.join("\n")
								: "No reports",
						),
				);
			}
		});
		return true;
	},
});
