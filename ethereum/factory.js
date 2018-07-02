import web3 from './web3';
import CampaignFactory from './build/RequestFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x7c22365248575C3F5Ec81517Ad5db5Db7c3dB6BE'
);

export default instance;
