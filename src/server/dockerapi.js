const Docker = require('dockerode')

let options = (process.platform === 'win32') ? { host: '127.0.0.1', port: 2375 } : { socketPath: '/var/run/docker.sock' }

module.exports = new Docker(options)
