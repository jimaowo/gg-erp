<template>
	<view class="content">
		<cu-custom bgColor="xg-nav"><block slot="content">登录</block></cu-custom>
		<view class="login-bg">
			<view class="login-card">
				<view class="login-head">请登录你的帐号</view>
				<view class="login-input login-margin-b">
					<input type="text" v-model="username" placeholder="手机号或者邮箱" />
				</view>
				<view class="login-input">
					<input type="text" :password="true" v-model="password" placeholder="请输入密码(6-16位)" />
				</view>
				<view class="login-function">
					<!-- <view class="login-forget" @tap="forget">忘记密码</view>
					<view class="login-register" @tap="reg">快速注册></view> -->
				</view>
			</view>
		</view>
		<view class="login-btn">
			<button class="landing" :loading="loading" type="primary" @tap="login">{{ loading ? "登录中...":"登 录"}}</button>
		</view>
		<view style="margin-top:8px;text-align: center;">
			<!--  #ifndef  MP-WEIXIN	 -->
			<!-- <image src="../../static/qq.png" @tap="qqlogin()"></image> -->
			<!--  #endif -->

			<!--  #ifdef  MP-WEIXIN	 -->
			<view style="margin-top:30px;text-align: center;">
				<view style='color:#FF978D'>微信登录</view>
			</view>
			<button open-type="getUserInfo" @getuserinfo="onGotUserInfo" class="logbt">
				<image src="../../static/wx.png"></image>
			</button>
			<!--  #endif -->
		</view>

	</view>
</template>

<script>
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				loading: false,
				username: "",
				password: "",
				from: "/pages/index/index"
			};
		},
		onLoad(e) {
			if(e.from) {
				this.from = e.from
			}
			if (e.token) {
				
			}
		},
		methods: {
			qqlogin() {
				uni.navigateTo({
					url: '../qqlogin/qqlogin',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			login() {
				this.loading = true;
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号或邮箱'
					});
					this.loading = false;
					return;
				}
				if (this.password == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入密码'
					});
					this.loading = false;
					return;
				}
				api.post({
					url: 'user/public/login',
					data: {
						username: this.username,
						password: this.password,
						device_type: api.DeviceType
					},
					success: data => {
						//console.log(data);
						if (data.code == 1) {
							this.loading = false;
							//console.log(data);
							// uni.showToast({
							// 	duration: 500,
							// 	title: data.msg
							// });
							// uni.setStorageSync('upload', 1)
							// uni.setStorageSync('login', 1)
							// uni.setStorageSync('token', data.data.token)
							// uni.setStorageSync('user', data.data.user)
							this.loginSuccess(data.data)
						}
						if (data.code == 0) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.msg
							});
						}
					}
				})
			},
			loginSuccess(e) {
				uni.showLoading()
				//console.log(e.token);
				uni.setStorageSync('upload', 1)
				uni.setStorageSync('login', 1)
				uni.setStorageSync('token', e.token)
				if(e.user) {
					uni.setStorageSync('user', e.user)
				}
				
				// 获取diy菜单并保存
				api.get({
					url: 'diy/menu',
					success: res => {
						uni.setStorageSync('menu', res.data)
					}
				});
				
				uni.showToast({
					duration: 1000,
					title: '登录成功'
				});
				
				setTimeout((e => {
					uni.hideLoading()
					uni.reLaunch({
						url: this.from
					});
				}), 1000);
				
				/* if(this.from) {
					setTimeout((e => {
						uni.hideLoading()
						uni.reLaunch({
							url: this.from
						});
					}), 1000);
				} else {
					setTimeout((e => {
						uni.hideLoading()
						uni.navigateBack();
					}), 500);
				} */
			},
			reg() {
				uni.navigateTo({
					url: '../register/register'
				});
			},
			forget() {
				uni.navigateTo({
					url: '../forget/forget'
				});
			},
			//小程序登录
			onGotUserInfo() {
				uni.login({
					success: loginRes => {
						if (loginRes.code) {
							uni.getUserInfo({
								withCredentials: true,
								success: res => {
									api.post({
										url: 'wxapp/public/login',
										data: {
											code: loginRes.code,
											encrypted_data: res.encryptedData,
											iv: res.iv,
											raw_data: res.rawData,
											signature: res.signature
										},
										success: data => {
											if (data.code == 1) {
												uni.showToast({
													title: '登录成功!',
													icon: 'success',
													duration: 500
												});
												try {
													uni.setStorageSync('upload', 1)
													uni.setStorageSync('login', 1)
													uni.setStorageSync('token', data.data.token)
													uni.setStorageSync('user', data.data.user)
												} catch (e) {}
												setTimeout(function() {
													uni.navigateBack()
												}, 500)
											}
										}
									});
								},
								fail: (res) => {
									if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
										uni.showModal({
											title: '用户授权失败',
											showCancel: false,
											content: '请删除此小程序重新授权!',
											success: function(res) {
												if (res.confirm) {
													console.log('用户点击确定')
												}
											}
										})
									}

								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.logbt {
		background: none;
		border: none !important;
		position: fixed;
		display: inline;
		margin-left: -76upx
	}

	.logbt:after {
		border: none !important;
	}

	image {
		width: 100upx;
		height: 100upx;
	}

	.landing {
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left, #006633, #669933);
	}

	.login-btn {
		padding: 10upx 20upx;
		margin-top: 350upx;
	}

	.login-function {
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}

	.login-forget {
		float: left;
		font-size: 26upx;
		color: #999;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 26upx;

	}

	.login-input input {
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}

	.login-margin-b {
		margin-bottom: 25upx;
	}

	.login-input {
		padding: 10upx 20upx;
	}

	.login-head {
		font-size: 34upx;
		text-align: center;
		padding: 25upx 10upx 55upx 10upx;
	}

	.login-card {
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 120upx;
	}

	.login-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#006633, #669933);
	}
</style>
