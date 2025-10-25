const getHostname = () => new URL(window.location.href).hostname

const getAppName = () => ['d', getHostname().split('.').join('')].join('-')

export const getName = (suffix) => [getAppName(), suffix].join('-')

export const getAdminID = () => getName('admin')

export const TIMEOUT = 1000

export const peer_config = {
  // config: {
  //   'iceServers': [
  //     {
  //       'urls': `stun:${getHostname()}:4224`
  //     }
  //   ],
  //   'sdpSemantics': 'unified-plan'
  // }
}

console.log('ADMIN', getAdminID())

console.log('NAME', getName('name'))

export const MESSAGES = {
  CONNECTIONS_LIST: 'connections-list',
  FREE: 'free',
}
