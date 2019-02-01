export const toHHMMSS = (secs: string) => {
	var sec_num = parseInt(secs, 10);
	var hours = Math.floor(sec_num / 3600) % 24;
	var minutes = Math.floor(sec_num / 60) % 60;
	var seconds = sec_num % 60;
	return [hours, minutes, seconds]
		.map((v) => (v < 10 ? "0" + v : v))
		.filter((v, i) => v !== "00" || i > 0)
		.join(":");
};

export const err = (msg: string) => `:negative_squared_cross_mark: ${msg}`;
export const check = (msg: string) => `:ok_hand: ${msg}`;
