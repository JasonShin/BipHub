import Events from 'events'
import _ from 'lodash'
import config from '../config'
import root from '../helpers/root'

const actions = config.get('actions')
let events = root.events

/**
 * Intializes IO
 * @param io
 */
function initialize(io) {
  if (typeof root.io === 'undefined') {
    events = new Events.EventEmitter()

    root.events = events
    root.io = io
    io.on('connection', (socket) => {
      _.forOwn(actions, (value) => {
        const { event } = value
        socket.on(event, (payload) => {
          const { query } = socket.handshake
          events.emit(event, { payload, query, socket })
        })
      })
    })
  }
}

const publish = ({ action, data, socket, callback }) => {
  const { io } = root
  console.log('publishing something ', data)
  if (io && !socket) {
    io.emit(action, data, callback)
  } else {
    socket.emit(action, data, callback)
  }
}

const subscribe = (action, callback) => {
  events.on(action, callback)
}

export default {
  initialize,
  publish,
  subscribe,
}
