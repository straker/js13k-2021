import CopperMiner from './copper-miner';

export default class IronMiner extends CopperMiner {
  constructor(properties) {
    super(properties);

    this.name = 'IRON-MINER';
    this.componentName = 'IRON';
  }
}
