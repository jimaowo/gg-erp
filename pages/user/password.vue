<template>
	<view class="content">
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">修改密码</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="doSubmit">
					<text class="margin-xs text-xl">保存</text>
				</view>
			</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<view class="title">新密码</view>
				<input placeholder="请输入新密码" v-model="new_password" password="true"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input placeholder="再次输入密码" v-model="confirm_password" password="true"></input>
			</view>
		</form>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	
	export default {
		data() {
			return {
				new_password: '',
				confirm_password: ''
			}
		},
		onLoad() {

		},
		methods: {
			doSubmit() {
				var np = this.new_password
				var cp = this.confirm_password
				if(np == '' || cp == '') {
					uni.showToast({
						icon: 'none',
						title: '密码不能为空'
					});
					return;
				}
				if(np.length < 6 || cp.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '至少输入六位密码'
					});
					return;
				}
				if(np != cp) {
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致'
					});
					return;
				}
				//请求修改密码接口
				api.put({
					url: 'home/user/password',
					data: {password: np},
					success: res => {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						if (res.code == 1) {
							setTimeout(function() {
								uni.navigateBack()
							}, 1500)
						}
						if (res.code == 0) {
							//错误的操作
						}
					}
				});
				
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
