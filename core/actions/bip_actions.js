import _ from 'lodash'
import Q from 'q'
import models from '../models'
import pubsub from '../pubsub'

/**
 * Forwarding bips to connected apps
 * @param bipEntity
 * @param data
 * @returns {Promise.<void>}
 */
async function forwardBip ({ bipEntity, data }) {
  if (!_.isEmpty(bipEntity)) {
    const outgoingAction = await models.OutgoingAction.findOne({ id: bipEntity.get('outgoing_actions_id') })
    const app = await models.App.findOne({ id: outgoingAction.get('app_id') })
    pubsub.publish({
      action: `${app.get('name')}_${outgoingAction.get('name')}`,
      data
    })
  }
}

/**
 * Foward all bips to outgoing actions
 */
async function fowardAllBips ({ bipEntities, data }) {
  const bipFoward = []
  _.forEach(bipEntities, (bipEntity) => {
    bipFoward.push(forwardBip({ bipEntity, data }))
  })
  return Q.all(bipFoward)
}

// Actual composed actions below

/**
 * Base bip action that reacts to incoming event and forward it to outgoing action
 * @param appName
 * @param incomingActionPayload
 * @param socket
 * @returns {Promise.<void>}
 */
async function bip ({
  appName,
	incomingActionPayload,
	socket
}) {
  if (appName && !_.isEmpty(incomingActionPayload) && socket) {
    const { meta } = incomingActionPayload
    // Find an app using appName
    const app = await models.App.findOne({ name: appName }, { withRelated: ['incomingActions', 'outgoingActions'] })
    // Find incoming actions of found app using name from meta data
    const incomingAction = await app.related('incomingActions').findOne({ name: meta.name })
    console.log('incoming action found ', incomingAction)
    // const foundBips = await models.Bip.findAll({ incoming_action_id: incomingAction.get('id') }, { withRelated: [] })
    /* const incomingAction = await models.IncomingAction.findOne({ app_id: app.id, name: meta.name })
    const rawBips = (await models.Bip.findAll({ incoming_actions_id: incomingAction.id })).models
    const checkedBips = await checkAllIncomingActionConditions({
      app, incomingAction, bipEntities: rawBips, incomingActionPayload, socket,
    })
    const result = fowardAllBips({ bipEntities: checkedBips, data: incomingActionPayload.data })
    return result */
  }
}

export default {
  bip
}
