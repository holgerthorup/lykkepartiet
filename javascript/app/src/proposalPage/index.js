import React, { Component } from 'react';
import Nav from '../nav/Nav.js'
import ProposalInfo from './ProposalInfo';
import ProposalArticles from './ProposalArticles';

class ProposalPage extends Component {

  constructor() {
    super();
    this.state = {
      proposalData: {},
    };
  }

  async componentDidMount() {
    const response = await fetch(`/api/proposal/${this.props.match.params.id}`);
    const proposalData = await response.json();
    this.setState({proposalData});
  }

  render() {
    const proposalData = this.state.proposalData;
    if (Object.keys(proposalData).length !== 0)
    {
      return (
        <div className = 'propsal-page'>
          <Nav history={this.props.history}/>
          <ProposalInfo proposalInfo = {proposalData.proposalInfo} polls = {proposalData.polls} />
          <ProposalArticles articles = {proposalData.articles} />
          <a href = '../'>
            back to list
          </a>
        </div>
      );
    } else {
      return (
        <div>
          loading...
        </div>
      );
    }
  }
}

export default ProposalPage;