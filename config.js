const getAppName = () => {
    const { hostname } = new URL(window.location.href)
    const isIP = hostname.split('.').every((n) => !isNaN(parseInt(n)))
    return (isIP ? hostname : hostname.split('.').at(0))
}

export const getName = (suffix) => [getAppName(), suffix].join('-')

export const getAdminID = () => getName('admin')

console.log('ADMIN', getAdminID())

console.log('NAME', getName('name'))

export const TIMEOUT = 2000

export const peer_config = {
  config: {
    'iceServers': [
      {
        'urls': 'stun:0.0.0.0:4224'
      }
    ],
    'sdpSemantics': 'unified-plan'
  }
}

