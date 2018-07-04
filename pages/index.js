import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Request from '../ethereum/request';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class RequestIndex extends Component {
  static async getInitialProps() {
    const requestAddresses = await factory.methods.getDeployedRequests().call();

    //This returns an array of promises which is not possible to await
    const requestPromises = requestAddresses.map(async address => {
      const request = Request(address);
      const summary = await request.methods.getSummary().call();

      return {
        requester: summary[0],
        title: summary[1],
        reward: web3.utils.fromWei(summary[5], 'ether'),
        anyPreviewApproved: summary[6],
        finalized: summary[7],
        address
      };
    });

    //Convert to a single promise to be able to await
    const requests = await Promise.all(requestPromises);

    return { requestAddresses, requests };
  }

  renderCampaigns() {
    const items = this.props.requests.map(request => {
      const extraText = request.finalized ? 'Closed' : 'Open';

      return {
        header: request.title,
        description: request.address,
        meta: request.reward + ' ETH',
        extra: extraText,
        fluid: true
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <div>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default RequestIndex;
