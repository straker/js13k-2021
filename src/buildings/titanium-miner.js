import CopperMiner from './copper-miner';

export default class TitaniumMiner extends CopperMiner {
  constructor(properties) {
    super(properties);

    this.name = 'TITANIUM-MINER';
    this.componentName = 'TITANIUM';
  }
}
