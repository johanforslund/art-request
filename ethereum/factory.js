import web3 from './web3';
import CampaignFactory from './build/RequestFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x67A57CE1397fB009AABab6f03A1571847AD17F0C'
);

export default instance;
