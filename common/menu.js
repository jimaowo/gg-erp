import api from './api.js'

var global_menu = {}
api.get({
	url: 'diy/menu',
	success: res => {
		console.log(res)
		global_menu = res.data
	}
});

module.exports = {
	global_menu
}
