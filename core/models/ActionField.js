import _ from 'lodash'
import Q from 'q'
import base from './base'
import db from '../bookshelf'
import schemaUtils from '../bookshelf/schemaUtils'

const { bookshelf } = db
const tableName = 'action_fields'

const ActionField = base.extend({
  tableName,
  action () {
    return this.belongsTo('Action')
  }
}, {
  attributes: schemaUtils.getAttributes(tableName),
  /**
   * Creates many incoming actions
   * @param fields
   * @param actionId
   * @returns {Promise.<*>}
   */
  async createMany ({ fields, actionId }) {
    const fns = []
    _.forOwn(fields, (field) => {
      field.action_id = actionId
      fns.push(this.create(field))
    })
    return Q.all(fns)
  }
})

const ActionFields = bookshelf.Collection.extend({
  model: ActionField
})

export default {
  single: bookshelf.model('ActionField', ActionField),
  collection: bookshelf.collection('ActionFields', ActionFields)
}
