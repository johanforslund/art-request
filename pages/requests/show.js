import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Request from '../../ethereum/request';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const request = Request(props.query.address);

    const summary = await request.methods.getSummary().call();
    const submissionsCount = await request.methods.getSubmissionsCount().call();

    const submissions = await Promise.all(
      Array(parseInt(submissionsCount)).fill().map(async (element, index) => {
        const result = await request.methods.submissions(index).call();
        result.index = index;
        return result;
      })
    );

    const openSubmissions = submissions.filter(submission => {
      return !submission.previewApproved;
    });

    const approvedSubmission = submissions.filter(submission => {
      return submission.previewUrl === 'http://www.submissionnew.com'; //Change this to previewApproved in future
    })[0]; //Filter function will return an array with 1 object, hence [0]

    return {
      requester: summary[0],
      title: summary[1],
      description: summary[2],
      email: summary[3],
      requestUrl: summary[4],
      reward: web3.utils.fromWei(summary[5], 'ether'),
      anyPreviewApproved: summary[6],
      finalized: summary[7],
      openSubmissions,
      approvedSubmission,
      address: props.query.address
    };
  }

  renderInfo() {
    const {
      requester,
      title,
      description,
      email,
      requestUrl,
      reward,
      anyPreviewApproved,
      finalized
    } = this.props;

    const items = [
      {
        header: requester,
        meta: 'Address of requester',
        description: 'This is the address of the person who created this request.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: email,
        meta: 'Email address',
        description: 'Contact this person for more information about this request',
        style: { overflowWrap: 'break-word' }
      },

    ];

    return <Card.Group items={items} />
  }

  renderOpenSubmissions() {
    return this.props.openSubmissions.map(submission => {
      return (
        <div class="card">
          <div class="image">
            <img src="https://cdn4.iconfinder.com/data/icons/flatified/512/photos.png" />
          </div>
          <div class="content">
            <div class="header">{submission.previewUrl}</div>
            <div style={{ overflowWrap: 'break-word'}} class="meta">
              <a>{submission.submitter}</a>
            </div>
          </div>
          <div class="extra content">
            <span class="right floated">
              2018-04-01
            </span>
            <span>
              <i class="clock outline icon"></i>
              Pending
            </span>
          </div>
        </div>
      );
    });
  }

  renderApprovedSubmission() {
    
  }

  render() {
    return (
      <Layout>
        <h1 class="ui header">
          {this.props.title}
          <div class="sub header">for <b>{this.props.reward}</b> ETH</div>
        </h1>

        <div class="ui message">
          <p>{this.props.description}</p>
        </div>

        <i class="globe icon"></i>
        <a href={this.props.requestUrl}>{this.props.requestUrl}</a>
        <br />

        <Link route={`/requests/${this.props.address}/submit`}>
          <button style={{ marginTop: 15 }} class="positive ui button fluid">Submit your edit</button>
        </Link>

        <div class="ui hidden divider"></div>
        <h4 class="ui horizontal divider header">Approved Submission</h4>
        <h5 style={{ color: '#B03060', textAlign: 'center' }}><i class="exclamation triangle icon"></i>No submission has yet been approved</h5>
        {this.renderApprovedSubmission()}

        <div class="ui hidden divider"></div>
        <h4 class="ui horizontal divider header">Open Submissions</h4>

        <div class="ui link cards">
          {this.renderOpenSubmissions()}
        </div>

        <div class="ui hidden divider"></div>
        <h4 class="ui horizontal divider header">More information</h4>
        {this.renderInfo()}

        <div class="ui icon positive message">
          <i class="lock open icon"></i>
          <div class="content">
            <p>This request is open for submission</p>
          </div>
        </div>


      </Layout>
    );
  }
}

export default CampaignShow;
