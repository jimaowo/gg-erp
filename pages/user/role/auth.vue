<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">权限设置</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="saveAuth">
					<text class="margin-xs text-xl">保存</text>
				</view>
			</block>
		</cu-custom>

		<view class="padding-sm bg-white text-bold">当前选择角色：{{roleName}}</view>

		<checkbox-group class="block" @change="CheckboxChange">
			<view v-for="(item,index) in checkbox" :key="index">
				<view class="padding-sm">{{moduleTitle[index]}}</view>
				<view class="grid col-2 bg-white">
					<view class="padding-sm" v-for="(menu,ix) in item" :key="ix">
						<label class="text-lg">
							<checkbox class='round blue' :class="checkbox[index][ix].checked?'checked':''" :checked="checkbox[index][ix].checked?true:false"
							 :value="menu.id+''"></checkbox>{{menu.text}}
						</label>
					</view>
				</view>
			</view>
		</checkbox-group>
		
		<view class="cu-load load-modal" v-if="loadModal">
			<view class="gray-text">权限设置中</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'

	export default {
		data() {
			return {
				roleID: null,
				moduleTitle: ['', '首页', '生产', '基础', '统计'],
				checkbox: [],
				loadModal: false
			}
		},
		onLoad(e) {
			this.roleID = e.roleID
			this.roleName = e.roleName
			this.getAuth()
		},

		methods: {
			getAuth() {
				api.get({
					url: 'home/roles/' + this.roleID + '/auth',
					data: {},
					success: res => {
						this.checkbox = res.data
					}
				});
			},
			//选择权限
			CheckboxChange(e) {
				var items = this.checkbox,
					values = e.detail.value;
				for (var i = 1; i <= 4; i++) {
					const module = items[i]
					for (var j = 0, lenJ = module.length; j < lenJ; ++j) {
						const item = module[j]
						if (values.includes(item.id + '')) {
							this.$set(item, 'checked', true)
						} else {
							this.$set(item, 'checked', false)
						}
					}

				}
			},
			
			//保存权限设置
			saveAuth() {
				this.loadModal = true
				api.request({
					url: 'home/roles/' + this.roleID + '/authorize',
					method: 'PUT',
					data: {
						rules:JSON.stringify(this.checkbox)
					},
					success: data => {
						this.loadModal = false
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						if (data.code == 1) {
							setTimeout(function() {
								uni.navigateBack()
							}, 1500)
						}
						if (data.code == 0) {
							//错误的操作
						}
					}
				});
			}
		}
	}
</script>

<style>

</style>
