import { cyanBright, green, magentaBright } from 'colorette';

export function help() {
	return `
  ___  ___ _ __ _ __  
 / __|/ _ \\ '__| '_ \\ 
 \\__ \\  __/ |  | | | |
 |___/\\___|_|  |_| |_|

 Welcome!
 If you're new to ${cyanBright('sern')}, run ${magentaBright(
		'sern init'
	)} for an interactive setup to your new bot project!

 ${green(
		`If you have any ideas, suggestions, bug reports, kindly join our support server: https://discord.gg/xzK5fUKT4r`
 )}`;
}
