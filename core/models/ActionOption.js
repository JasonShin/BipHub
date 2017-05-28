import R from 'ramda'
import Q from 'q'
import base from './base'
import db from '../bookshelf'
import schemaUtils from '../bookshelf/schemaUtils'

const { bookshelf } = db
const tableName = 'incoming_action_options'

const ActionOption = base.extend({
  tableName,
  actions () {
    return this.belongsTo('Action')
  }
}, {
  attributes: schemaUtils.getAttributes(tableName),
  /**
   * @param options
   * @param actionId
   * @returns {Promise.<*>}
   */
  async createMany (options, actionId) {
    return R.compose(
      (fns) => fns ? Q.all(fns) : null,
      R.map(x => this.create(x)),
      R.values,
      R.map(R.assoc('action_id', actionId))
    )(options)
  }
})

const ActionOptions = bookshelf.Collection.extend({
  model: ActionOption
})

export default {
  single: bookshelf.model('ActionOption', ActionOption),
  collection: bookshelf.collection('ActionOptions', ActionOptions)
}
