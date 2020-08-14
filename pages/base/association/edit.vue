<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">修改外协</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="editSubmit">
					<text class="sm margin-xs">保存</text>
				</view>
			</block>
		</cu-custom>

		<form>
			<view class="padding-sm">基本信息</view>
			<xg-input title="编码" v-model="params['code']"></xg-input>
			<xg-input title="名称" v-model="params['name']"></xg-input>
			<xg-input title="电话" v-model="params['tel']"></xg-input>
			<xg-input title="地址" v-model="params['address']"></xg-input>
			<xg-input title="联系人" v-model="params['contact_name']"></xg-input>
			<xg-input title="联系人电话" v-model="params['contact_tel']"></xg-input>
			<xg-input title="工厂人数" v-model="params['staff_count']"></xg-input>
			
			<view class="cu-form-group" @click="showTypePicker">
				<view class="title">外协类型<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['type_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showLevelPicker">
				<view class="title">评审等级</view>
				<input disabled="true" placeholder="请选择" :value="params['level_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showQualPicker">
				<view class="title">是否合格</view>
				<input disabled="true" placeholder="请选择" :value="params['is_qualified_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<xg-input title="备注" v-model="params['remarks']"></xg-input>
		</form>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'

	export default {
		data() {
			return {
				itemID: null,
				params: {},
				themeColor: '#006633',
				mode: 'selector',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				typeArray: [],
				levelArray: [],
				qualArray: [
					{label: '合格', value: 1},
					{label: '不合格', value: 2}
				],
				pickerType: 0
			}
		},
		components: {
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			console.log(e)
			// 获取要修改的一条资源
			this.itemID = e.id
			this.getEditOne()
			this.getTypeList()
			this.getLevelList()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'base/associations/' + this.itemID,
					success: res => {
						// console.log(res);
						this.params = res.data
						// 可以在这设置各选择框的默认选择
					}
				});
			},
			getTypeList() {
				api.get({
					url: 'base/association/types/all',
					success: res => {
						//console.log(res);
						this.typeArray = res.data
					}
				});
			},
			getLevelList() {
				api.get({
					url: 'base/association/levels',
					success: res => {
						this.levelArray = res.data
					}
				});
			},
			// 类型选择
			showTypePicker() {
				this.pickerValueArray = this.typeArray
				this.pickerType = 1
				this.$refs.mpvuePicker.show()
			},
			// 等级选择
			showLevelPicker() {
				this.pickerValueArray = this.levelArray
				this.pickerType = 2
				this.$refs.mpvuePicker.show()
			},
			// 是否合格选择
			showQualPicker() {
				this.pickerValueArray = this.qualArray
				this.pickerType = 3
				this.$refs.mpvuePicker.show()
			},
			onCancel(e) {
				//console.log(e)
			},
			onConfirm(e) {
				switch (this.pickerType){
					case 1:
						this.params['type_id'] = e.value[0]
						this.$set(this.params, 'type_name', e.label)
						break;
					case 2:
						this.params['level_id'] = e.value[0]
						this.$set(this.params, 'level_name', e.label)
						break;
					case 3:
						this.params['is_qualified'] = e.value[0]
						this.$set(this.params, 'is_qualified_name', e.label)
						break;
					default:
						break;
				}
			},
			editSubmit() {
				// console.log(this.params)
				if(this.params['type_id'] == null) {
					uni.showToast({
						icon:"none",
						title:"请选择外协类型"
					})
					return;
				}
				api.put({
					url: 'base/associations/' + this.itemID,
					data: this.params,
					success: res => {
						// console.log(res);
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						if (res.code == 1) {
							uni.setStorageSync('need_refresh', true)
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
