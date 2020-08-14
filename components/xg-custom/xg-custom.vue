<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="showDrawer" v-if="isDrawer">
					<text class="xg-drawer-icon cuIcon-profile text-white"></text>
				</view>
				<view class="content xg-title" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>

		<view>
			<uni-drawer :visible="showLeft" mode="left" @close="closeDrawer('left')">
				<view class="bg-white">
					<view class="flex padding justify-center">
						<view class="cu-avatar xl round" :style="avatarStyle"></view>
					</view>
					<view class="flex justify-center">{{nickname}}</view>
					<view class="flex padding-sm justify-center">{{username}}</view>

					<view class="cu-list menu margin-top-xl">
						<view v-if="userType==2" class="cu-item arrow">
							<navigator class="content xg-left-menu" hover-class="none" url="../../pages/user/user">
								<text class="cuIcon-friend"></text>
								<text class="text-grey">员工管理</text>
							</navigator>
						</view>
						<view v-if="userType==2" class="cu-item arrow">
							<navigator class="content xg-left-menu" hover-class="none" url="../../pages/user/role/role">
								<text class="cuIcon-explore"></text>
								<text class="text-grey">角色权限</text>
							</navigator>
						</view>
						<view class="cu-item arrow">
							<navigator class="content xg-left-menu" hover-class="none" url="../../pages/user/password">
								<text class="cuIcon-lock"></text>
								<text class="text-grey">密码修改</text>
							</navigator>
						</view>
						<view class="cu-item arrow">
							<navigator class="content xg-left-menu" hover-class="none" url="../../pages/info/about">
								<text class="cuIcon-info"></text>
								<text class="text-grey">关于我们</text>
							</navigator>
						</view>
						<view class="cu-item arrow" @click="logout">
							<view class="content xg-left-menu">
								<text class="cuIcon-pullleft"></text>
								<text class="text-grey">退出</text>
							</view>
						</view>
					</view>

					<!-- <view class="flex padding align-end justify-center">
						<button class="cu-btn round" @click="hide">关闭侧边栏</button>
					</view> -->
				</view>

			</uni-drawer>
		</view>
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import api from '@/common/api.js'

	export default {
		components: {
			uniDrawer
		},
		data() {
			return {
				showLeft: false,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				avatar: uni.getStorageSync('user').avatar,
				nickname: uni.getStorageSync('user').user_nickname,
				username: uni.getStorageSync('user').user_login,
				userType:uni.getStorageSync('user').user_type
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			},
			avatarStyle() {
				var avatar = this.avatar;
				var avatarStyle = `background-image:url(${avatar});`;
				if (this.avatar == '') {
					avatarStyle = `background-image:url(http://demo-erp-api.jimaowo.com/upload/default-avatar.jpg);`;
				}
				return avatarStyle
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			isDrawer: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			showDrawer() {
				this.showLeft = true
			},
			hide() {
				this.showLeft = false
			},
			closeDrawer(e) {
				this.showLeft = false
			},
			logout() {
				console.log('logout start!')
				this.hide();
				//var that = this;
				uni.showModal({
					title: '提示',
					content: '确定要退出登录？',
					success: function(res) {
						if (res.confirm) {
							api.post({
								url: 'user/public/logout',
								method: 'POST',
								success: (data) => {
									uni.clearStorageSync()
									//that.userinfo = ''
									uni.navigateTo({
										url: '/pages/login/login'
									});
								}
							});
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		}
	}
</script>

<style>
	.xg-left-menu {
		text-align: left;
	}
	
	/* .xg-title {
		font-size: 46upx;
	} */
	.xg-drawer-icon {
		font-size: 46upx !important;
	}
</style>
