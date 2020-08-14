<script>
	import Vue from 'vue'
	import api from '@/common/api.js'

	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			// 获取diy菜单并保存
			api.get({
				url: 'diy/menu',
				success: res => {
					uni.setStorageSync('menu', res.data)
				}
			});

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";

	page {
		background-color: #eee;
	}

	.xg-nav {
		/* background: #006633; */
		background: -webkit-linear-gradient(left, #006633, #669933);
		color: #ffffff;
	}

	.xg-nav-one-color {
		background: #006633;
		color: #ffffff;
	}

	/* xg 金色 */
	.bg-gold {
		background-color: #006633;
		color: #ffffff;
	}

	.text-gold,
	.line-gold,
	.lines-gold {
		color: #006633;
	}

	.line-gold::after,
	.lines-gold::after {
		border-color: #006633;
	}

	/* xg 粉色 */
	.bg-gpink {
		background-color: #CC9999;
		color: #ffffff;
	}

	.text-gpink,
	.line-gpink,
	.lines-gpink {
		color: #CC9999;
	}

	.line-gpink::after,
	.lines-gpink::after {
		border-color: #339999;
	}

	/* xg 蓝色 */
	.bg-gblue {
		background-color: #339999;
		color: #ffffff;
	}

	.text-gblue,
	.line-gblue,
	.lines-gblue {
		color: #339999;
	}

	.line-gblue::after,
	.lines-gblue::after {
		border-color: #339999;
	}

	/* 搜索排序栏 */
	.xg-search-sort {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 99;
	}

	.margin-top-xxl {
		margin-top: 120upx;
	}

	.xg-nav .text-xl {
		font-size: 32upx;
	}

	.cu-modal {
		z-index: 111;
	}
</style>
