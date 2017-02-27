import base from './base'
import IncomingAction from './IncomingAction'
import OutgoingAction from './OutgoingAction'

const Bip = base.extend({
  tableName: 'bips',
  hasTimestamps: true,
}, {
  async registerBip({ bip, incomingActions, outgoingActions }) {
    const savedBip = await this.create(bip, null)
    IncomingAction.registerIncomingActions({ incomingActions, bipId: savedBip.id })
    OutgoingAction.registerOutgoingActions({ outgoingActions, bipId: savedBip.id })
    return savedBip
  },
  async setBipActive(bipId) {
    const foundBip = await this.findOne({ id: bipId })
    foundBip.attributes.active = true
    return this.update(foundBip.attributes)
  },
  async setBipInactive(bipId) {
    const foundBip = await this.findOne({ id: bipId })
    foundBip.attributes.ative = false
    return this.update(foundBip.attributes)
  },
})

export default Bip
