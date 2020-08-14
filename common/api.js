//判断登录设备
//#ifdef H5
var device_type = 'web'
//#endif

//#ifdef APP-PLUS
var device_type = 'mobile'
//#endif

//#ifdef MP
var device_type = 'wxapp'
//#endif

var app = getApp();

var host = "http://demo-erp-api.jimaowo.com"; //替换为自己的域名,小程序需要https
var socketUrl = "wss://gg.com:39005/"; //替换为自己的websocket地址,小程序需要wss

module.exports = {
	socketUrl: socketUrl,
	HOST: host,
	API_ROOT: host + '/api/',
	DeviceType: device_type,
	post(options) {
		this.request(options);
	},
	delete(options) {
		options.method = 'DELETE';
		this.request(options);
	},
	get(options) {
		options.method = 'GET';
		this.request(options);
	},
	put(options) {
		options.method = 'PUT';
		this.request(options);
	},
	request(options) {
		var apiRoot = this.API_ROOT;
		var token = '';
		try {
			token = uni.getStorageSync('token')
		} catch (e) {
			// Do something when catch error
		}

		uni.request({
			url: apiRoot + options.url,
			data: options.data,
			method: options.method ? options.method : 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'XX-Token': token,
				'XX-Device-Type': device_type,
			},
			success: res => {
				var data = res.data;
				if (data.code == 10001) {
					uni.showToast({
						title: "登录失效，请重新登录...",
						icon: "none"
					});
					var fromPage = options.fromp ? options.fromp : "";
					setTimeout(function() {
						uni.navigateTo({
							url: '/pages/login/login?from=' + fromPage
						});
					}, 2000)
				} else {
					options.success(data);
				}
			},
			fail: function(res) {
				if (options.fail) {
					options.fail(res)
				}
			},
			complete: options.complete ? options.complete : null
		});
	},
	uploadFile(options) {

		options.url = this.API_ROOT + options.url;

		let token = this.getToken();

		let that = this;

		let oldSuccess = options.success;
		options.success = function(res) {
			//console.log(res.data);
			let data = JSON.parse(res.data);
			if (data.code == 0 && data.data && data.data.code && data.data.code == 10001) {
				// uni.navigateTo({
				//     url: '/pages/login/login'
				// });
				that.login();
			} else {
				oldSuccess(data);
			}
		}

		options.header = {
			'XX-Token': token,
			'XX-Device-Type': device_type
		};
		uni.uploadFile(options);

	},
	getToken() {
		var token = '';
		try {
			token = uni.getStorageSync('token')
		} catch (e) {
			// Do something when catch error
		}
		return token;
	},
	//删除资源
	ggDelete(deleteUrl, callback) {
		var that = this;
		uni.showModal({
			title: '提示',
			content: '确定要删除该项吗？',
			success: function(res) {
				if (res.confirm) {
					that.delete({
						url: deleteUrl,
						success: data => {
							uni.showToast({
								icon: 'none',
								title: data.msg
							});
							if (data.code == 1) {
								callback()
							}
							if (data.code == 0) {
								//错误的操作
							}
						}
					});
				} else if (res.cancel) {
					//console.log('用户点击取消')
				}
			}
		})
	},
	//确认是否执行请求
	ggConfirm(options, callback) {
		var that = this;
		uni.showModal({
			title: options.title || '提示',
			content: options.content || '确定要执行该操作吗？',
			success: function(res) {
				if (res.confirm) {
					that.request({
						url: options.url,
						data: options.data,
						method: options.method ? options.method : 'POST',
						success: data => {
							uni.showToast({
								icon: 'none',
								title: options.msg || data.msg
							});
							if (data.code == 1) {
								callback()
							}
							if (data.code == 0) {
								console.log(data)
								//错误的操作
							}
						}
					});
				} else if (res.cancel) {
					//console.log('用户点击取消')
				}
			}
		})
	}

};
