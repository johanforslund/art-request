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
    const sentEther = await web3.utils.toWei('5', 'ether');
    const requestBalance = await web3.eth.getBalance(requestAddress);
    assert.equal(sentEther, requestBalance);
  });

  it('sets title, description, email and url correctly', async () => {
    const title = await request.methods.title().call();
    const description = await request.methods.description().call();
    const email = await request.methods.email().call();
    const url = await request.methods.url().call();
    assert.equal('Remove scratches', title);
    assert.equal('Please remove the scratches from this picture', description);
    assert.equal('user@email.com', email);
    assert.equal('http://url.com', url);
  });

  it('is possible to remove request if no preview have been approved (and get ether back)', async () => {
    let balanceBefore = await web3.eth.getBalance(accounts[0]);
    balanceBefore = web3.utils.fromWei(balanceBefore, 'ether');
    balanceBefore = parseFloat(balanceBefore);

    await request.methods.remove().send({
      from: accounts[0],
      gas: '3000000'
    });

    let balanceAfter = await web3.eth.getBalance(accounts[0]);
    balanceAfter = web3.utils.fromWei(balanceAfter, 'ether');
    balanceAfter = parseFloat(balanceAfter);

    assert((balanceAfter - balanceBefore) > 4.99);
  });

  it('is NOT possible to remove request if any preview have been approved', async () => {
    await submitAndApprovePreview();

    try {
      await request.methods.remove().send({
        from: accounts[0],
        gas: '3000000'
      });
    } catch (err) {
      assert(err);
      return;
    }
    assert(false);
  });

  it('is NOT possible to remove if you are not requester', async () => {
    try {
      await request.methods.remove().send({
        from: accounts[1],
        gas: '3000000'
      });
    } catch (err) {
      assert(err);
      return;
    }
    assert(false);
  });

  it('is possible to remove if final have been approved (ether burn)', async () => {
    await submitAndApprovePreview();
    await submitAndApproveFinal();

    let balanceBefore = await web3.eth.getBalance(accounts[0]);
    balanceBefore = web3.utils.fromWei(balanceBefore, 'ether');
    balanceBefore = parseFloat(balanceBefore);

    await request.methods.remove().send({
      from: accounts[0],
      gas: '3000000'
    });

    let balanceAfter = await web3.eth.getBalance(accounts[0]);
    balanceAfter = web3.utils.fromWei(balanceAfter, 'ether');
    balanceAfter = parseFloat(balanceAfter);

    assert((balanceAfter - balanceBefore) < 0.01);
  });
});


/**********************************************************************************************
    Helper functions
**********************************************************************************************/
const submitAndApprovePreview = async () => {
  await request.methods.submitPreview('http://preview.com', 'submitter@email.com').send({
    from: accounts[1],
    gas: '3000000'
  });

  await request.methods.approvePreview(0).send({
    from: accounts[0],
    gas: '3000000'
  });
}

const submitAndApproveFinal = async () => {
  await request.methods.submitFinal(0, 'http://final.com').send({
    from: accounts[1],
    value: web3.utils.toWei('1', 'ether'),
    gas: '3000000'
  });

  await request.methods.approveFinal(0).send({
    from: accounts[0],
    gas: '3000000'
  });
}
