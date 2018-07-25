import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Request from '../../ethereum/request';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const request = Request(props.query.address);

    const summary = await request.methods.getSummary().call();
    const submissionsCount = await request.methods.getSubmissionsCount().call();

    const submissions = await Promise.all(
      Array(parseInt(submissionsCount)).fill().map((element, index) => {
        return request.methods.submissions(index).call();
      })
    );

    return {
      requester: summary[0],
      title: summary[1],
      description: summary[2],
      email: summary[3],
      requestUrl: summary[4],
      reward: web3.utils.fromWei(summary[5], 'ether'),
      anyPreviewApproved: summary[6],
      finalized: summary[7],
      submissions
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

  renderSubmissions() {
    console.log(this.props.submissions);
    return this.props.submissions.map(submission => {
      return (
        <div class="ui link cards">
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
        </div>
      );
    });
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

        <div class="ui hidden divider"></div>
        <h4 class="ui horizontal divider header">Submissions</h4>

        {this.renderSubmissions()}

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
