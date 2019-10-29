import React from 'react';
import { connect } from 'react-redux';

import { ScratchOrg, OrgUser } from 'common/data/orgs';

import { TitleBar } from './Titlebar';
import { Actions } from './actions/Actions';
import { Details } from './details/Details';
import Sidebar from './sidebar/Sidebar';
import { StoreState } from 'common/store/state';
import { ProjectConfig } from 'common/data/projects';
import { NonIdealState, Card } from '@blueprintjs/core';

interface StateProps {
	scratchOrgs: { [username: string]: ScratchOrg };
	users: { [username: string]: OrgUser };
	projects: { [projectDir: string]: ProjectConfig };
}

type Props = StateProps;

interface State {
	selectedUsername?: string;
}

function mapStateToProps(state: StoreState): StateProps {
	return {
		scratchOrgs: state.org.scratchOrgs,
		users: state.org.users,
		projects: state.project.projectMap
	};
}

const isDark = true;

class App extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.handleOrgSelection = this.handleOrgSelection.bind(this);
		this.state = {};
	}

	public handleOrgSelection(selectedUsername: string) {
		this.setState({
			...this.state,
			selectedUsername
		});
	}

	public render() {
		const username = this.state.selectedUsername;

		let contents: any;

		if (username) {
			const selectedOrg = this.props.scratchOrgs[username];
			const orgProject = Object.values(this.props.projects).find((project) => (
				selectedOrg.username in project.orgUsernames
			));

			contents = <>
				<Details scratchOrg={selectedOrg} />
				<Actions orgUsername={username} orgProject={orgProject} />
			</>;
		} else {
			contents = (
				<Card className='mb-4 mx-4 p-2'>
					<NonIdealState className='pb-4' icon='error' description='Select an org to view details' />
				</Card>);
		}
		let baseStyles = 'sb-app h-full';
		if (isDark) {
			baseStyles += ' bp3-dark';
		}

		return (
			<div className={baseStyles}>
				<div className='vh-90'>
					<TitleBar />
					<div id='scratchboard' className='flex'>
						<Sidebar isDark={true} orgUsername={username} onOrgSelect={this.handleOrgSelection} />
						<div id='main' className='flex-auto'>
							{contents}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps)(App);
