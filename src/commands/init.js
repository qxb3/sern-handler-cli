import prompts from 'prompts';
import ora from 'ora';
import { redBright, yellowBright } from 'colorette';
import { execa } from 'execa';
import {
	cmds_dir,
	default_prefix,
	lang,
	main_dir,
	gitInit,
	which_manager,
	name,
} from '../prompts/init.js';
import { npm } from '../utilities/npm.js';
import { cloneRepo, installDeps } from '../utilities/install.js';
import { editDirs, editMain } from '../utilities/edits.js';
const { prompt } = prompts;

export async function init({ flags }) {
	if (flags?.includes('y')) {
		// TODO for @Allyedge: make this functional
		console.log("I see the -y flag there! Seems like you're lazy!\nBye!");
		process.exit(0);
	}

	const node = await execa('node', ['--version']);

	if (/v1(([0-6]\.[2-9])|([0-5]\.[0-9]))/gm.test(node.stdout)) {
		console.log(
			yellowBright(
				`\nYou are using Node ${node.stdout}\nPlease upgrade to Node 16.10.x or higher!\n`
			)
		);

		process.exit(1);
	}

	const data = await prompt([name, lang, main_dir, cmds_dir, default_prefix]);

	if (Object.keys(data).length < 5) process.exit(1);

	await cloneRepo(data.lang, data.name);

	let git_init;

	isDefault ? git_init.gitInit = true : git_init = await prompt([gitInit])

	if (!git_init.gitInit) {
		console.log(`\Skipping git init...\n`);
	} else {
		const spin = ora({
			text: 'Initializing git...',
			spinner: 'aesthetic',
		}).start();

		const exe = await execa('git', ['init', data.name]);

		await wait(300);

		if (!exe || exe?.failed) {
			spin.fail(
				`${redBright('Failed')} to initialize git!` +
					'\nMaybe you should run git init?'
			);
			process.exit(1);
		}

		spin.succeed('Git initialized!');
	}

	let pm;

	if (!isDefault) {
		pm = await npm();
	} else {
		pm = 'npm';
	}

	let choice = '';

	if (pm === 'both') {
		const chosen = await prompt([which_manager]);
		choice = chosen.manager;
	} else choice = pm;

	await installDeps(choice, data.name);

	await editMain(data.name);

	await editDirs(data.main_dir, data.cmds_dir, data.name);
}

/**
 * Wait for a specified number of milliseconds, then return a promise that resolves to undefined.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns A function that takes a single argument, ms, and returns a promise that resolves after ms
 * milliseconds.
 */
async function wait(ms) {
	const wait = (await import('util')).promisify(setTimeout);
	return wait(ms);
}
