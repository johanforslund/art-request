import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Request from '../../ethereum/request';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const request = Request(props.query.address);

    const summary = await request.methods.getSummary().call();

    return {
      requester: summary[0],
      title: summary[1],
      description: summary[2],
      email: summary[3],
      requestUrl: summary[4],
      reward: web3.utils.fromWei(summary[5], 'ether'),
      anyPreviewApproved: summary[6],
      finalized: summary[7]
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
    const items = [
      {
        header: 'http://url1.com',
        meta: '2018-04-01',
        description: '0x733F64087efeB50183bb8B2D3cDb3ce824F968Ad',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: 'asd',
        meta: 'Email address',
        description: 'Contact this person for more information about this request',
        style: { overflowWrap: 'break-word' }
      },

    ];

    return <Card.Group items={items} />
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

        <div class="ui link cards">
          <div class="card">
            <div class="image">
              <img src="https://cdn4.iconfinder.com/data/icons/flatified/512/photos.png" />
            </div>
            <div class="content">
              <div class="header">http://www.url1.com</div>
              <div style={{ overflowWrap: 'break-word'}} class="meta">
                <a>0x733F64087efeB50183bb8B2D3cDb3ce824F968Ad</a>
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
          <div class="card">
            <div class="image">
              <img src="https://cdn4.iconfinder.com/data/icons/flatified/512/photos.png" title="" />
            </div>
            <div class="content">
              <div class="header">http://www.url2.com</div>
              <div style={{ overflowWrap: 'break-word'}} class="meta">
                <span class="date">0x733F64087efeB50183bb8B2D3cDb3ce824F968Ad</span>
              </div>
            </div>
            <div class="extra content">
              <span class="right floated">
                2018-04-05
              </span>
              <span>
                <i class="clock outline icon"></i>
                Pending
              </span>
            </div>
          </div>
          <div class="card">
            <div class="image">
              <img src="https://cdn4.iconfinder.com/data/icons/flatified/512/photos.png" title="" />
            </div>
            <div class="content">
              <div class="header">http://www.url3.com</div>
              <div style={{ overflowWrap: 'break-word'}} class="meta">
                <a>0x733F64087efeB50183bb8B2D3cDb3ce824F968Ad</a>
              </div>
            </div>
            <div class="extra content">
              <span class="right floated">
                2018-04-08
              </span>
              <span>
                <i class="clock outline icon"></i>
                Pending
              </span>
            </div>
          </div>
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
