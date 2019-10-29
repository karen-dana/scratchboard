import React from 'react';
let os = require('os');
let pty = require('node-pty');
import { Terminal } from 'xterm';
import '../../../../../node_modules/xterm/css/xterm.css';
import { ProjectConfig } from 'common/data/projects';
import { number } from 'prop-types';
import './Terminal.css';

interface Props {
	orgProject?: ProjectConfig;
	isTerm: boolean;
}

export class Term extends React.Component<Props> {

	public constructor(props: Props) {
		super(props);
		this.state = {
			loadedBefore: false,
		};
	}

	public render() {
		return (
			<div className="flex mx-auto pb-5 w-full border-solid border shadow border-blue-900 rounded overflow-hidden bg-term">
				<div ref="xterm" className='w-full'></div>
			</div>
		);
	}

	componentDidUpdate() {
		if (this.props.isTerm && !this.state.loadedBefore) {
			this.loadTerm();
		}
	}

	loadTerm() {
		const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
		const ptyProcess = pty.spawn(shell, [], {
			name: 'xterm-color',
			cwd: this.props.orgProject ? this.props.orgProject.projectDir : process.env.HOME,
			env: process.env
		});
		
		// Update with colors as you find the need.
		// iTerm Theme docs: https://xtermjs.org/docs/api/terminal/interfaces/itheme/
		// Terminal colors for reference: https://jeffkreeftmeijer.com/vim-16-color/
		const xterm = new Terminal({
			cursorBlink: true,
			cols: 100,
			rows: 25,
			theme: {
				background: '#202B33',
				cursor: '#00ff00',
				cursorAccent: '#293742',
				red: '#ff443a',
				selection: 'transparent'
			}
		});

		xterm.writeln('Welcome to Scratchboard Terminal. If using bash, you may want to use `exec bash -l`.');
		xterm.open(this.refs.xterm);
		xterm.focus();

		xterm.onData(data => ptyProcess.write(data));
		ptyProcess.on('data', function (data) {
			xterm.write(data);
		});
		this.state.loadedBefore = true;
	}
}
