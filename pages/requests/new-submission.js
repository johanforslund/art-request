import React, { Component } from 'react';
import { Form, Button, TextArea, Input, Message } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Request from '../../ethereum/request';

class SubmissionNew extends Component {
  static async getInitialProps(props) {
    const request = Request(props.query.address);

    const title = await request.methods.title().call();

    return {
      address: props.query.address,
      title
    };
  }

  state = {
    url: '',
    email: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const { url, email } = this.state;

    try {
      const request = Request(this.props.address);

      const accounts = await web3.eth.getAccounts();

      await request.methods.submitPreview(url, email).send({
        from: accounts[0]
      });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <Layout>
        <h2 class="ui header">
          New Submission
          <div class="sub header"><i class="arrow alternate circle right icon"></i>{this.props.title}</div>
        </h2>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>URL</label>
            <Input
              value={this.state.url}
              onChange={event => this.setState({url: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Email (optional)</label>
            <Input
              value={this.state.email}
              onChange={event => this.setState({email: event.target.value })}
            />
          </Form.Field>

          <Message error header="Error!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} type="submit">Submit</Button>
        </Form>
      </Layout>
    );
  }
}

export default SubmissionNew;
