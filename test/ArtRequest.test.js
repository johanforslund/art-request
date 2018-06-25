const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: 5800000 }));

const compiledFactory = require('../ethereum/build/RequestFactory.json');
const compiledRequest = require('../ethereum/build/Request.json');

let accounts;
let factory;
let requestAddress;
let request;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '3000000' });

  await factory.methods.createRequest('Remove scratches', 'Please remove the scratches from this picture', 'user@email.com', 'http://url.com').send({
    from: accounts[0],
    value: web3.utils.toWei('5', 'ether'),
    gas: '3000000'
  });

  [requestAddress] = await factory.methods.getDeployedRequests().call();
  request = await new web3.eth.Contract(
    JSON.parse(compiledRequest.interface),
    requestAddress
  );
});

describe('Requests', () => {
  it('deploys a factory and a request', () => {
    assert.ok(factory.options.address);
    assert.ok(request.options.address);
  });

  it('marks caller as the requester', async () => {
    const requester = await request.methods.requester().call();
    assert.equal(accounts[0], requester);
  });

  it('receives the correct amount of ether', async () => {
    sentEther = await web3.utils.toWei('5', 'ether');
    requestBalance = await web3.eth.getBalance(requestAddress);
    assert.equal(sentEther, requestBalance);
  });
});
