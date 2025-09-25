const packageJSON = require('./package.json')
const getKarmaConfig = require('resin-config-karma')

module.exports = (config) => {
	const karmaConfig = getKarmaConfig(packageJSON)
	config.set(karmaConfig)
}
