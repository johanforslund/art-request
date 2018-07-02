import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Request from '../ethereum/request';
import factory from '../ethereum/factory';

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
        reward: summary[5],
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
      return {
        header: request.title,
        description: request.address,
        meta: '$' + request.reward,
        extra: 'Open?',
        fluid: true
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
        {this.renderCampaigns()}
      </div>
    );
  }
}

export default RequestIndex;
