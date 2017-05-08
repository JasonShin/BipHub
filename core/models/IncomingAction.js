import _ from 'lodash';
import Q from 'q';
import base from './base';
import db from '../bookshelf';
import models from './index';
import schemaUtils from '../bookshelf/schemaUtils';

const { bookshelf } = db;
const tableName = 'incoming_actions';

const IncomingAction = base.extend({
  tableName,
  app () {
    return this.belongsTo('App');
  },
  incomingActionsFields () {
    return this.hasMany('IncomingActionField');
  }
}, {
  attributes: schemaUtils.getAttributes(tableName),
	/**
   * create one incoming action
	 * @param entity
	 * @param appId
	 * @returns {Promise.<boolean>}
	 */
  async createOne ({ entity, appId }) {
    const fields = _.get(entity, 'fields', null);
    const options = _.get(entity, 'options', null);
    entity.app_id = appId;
    const incAction = await this.create(entity, null);
    const incomingActionId = incAction.get('id');
    const fieldsCreateResult =
      await models.IncomingActionField.createMany({ fields, incomingActionId });
    const optionsCreateResult =
      await models.IncomingActionOption.createMany({ options, incomingActionId });

    return fieldsCreateResult && optionsCreateResult;
  },
	/**
   * Creates many incoming actions
	 * @param incomingActions
	 * @param appId
	 * @returns {Promise.<void>}
	 */
  async createMany ({ incomingActions, appId }) {
    const forgedIncActions = incomingActions.map(entity => this.createOne({ entity, appId }));
    Q.all(forgedIncActions);
  },
	/**
	 * @param endPoint
	 * @param action
	 * @returns {*}
	 */
  findByEndPoint (endPoint, action) {
    const endPointVariation = `/${endPoint}`;
    const actionVariation = `/${action}`;
    return this.findOne({ endPoint: endPointVariation, action: actionVariation });
  }
});

const IncomingActions = bookshelf.Collection.extend({
  model: IncomingAction
});

export default {
  single: bookshelf.model('IncomingAction', IncomingAction),
  collection: bookshelf.collection('IncomingActions', IncomingActions)
};
