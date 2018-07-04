import React, { Component } from 'react';
import { Form, Button, TextArea, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class RequestNew extends Component {
  state = {
    title: '',
    description: '',
    email: '',
    url: '',
    reward: ''
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const { title, description, email, url, reward } = this.state;
    const accounts = await web3.eth.getAccounts();

    await factory.methods.createRequest(title, description, email, url).send({
      from: accounts[0],
      value: web3.utils.toWei(reward, 'ether') * 1.2 //Add a 20% deposit
    });

    Router.pushRoute('/');
  };

  render() {
    return (
      <Layout>
        <h2>New Request</h2>

        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={event => this.setState({title: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Desciption</label>
            <TextArea
              value={this.state.description}
              onChange={event => this.setState({description: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <Input
              value={this.state.email}
              onChange={event => this.setState({email: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>URL (optional)</label>
            <Input
              value={this.state.url}
              onChange={event => this.setState({url: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Reward</label>
            <Input
              label="ether"
              labelPosition="right"
              value={this.state.reward}
              onChange={event => this.setState({reward: event.target.value })}
            />
          </Form.Field>
          <Form.Field disabled>
            <label>Deposit</label>
            <Input
              label="ether"
              labelPosition="right"
              value={this.state.reward ? this.state.reward * 0.2 : ''}
            />
          </Form.Field>
          <Button type='submit'>Submit</Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
