<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">修改供应商</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="editSubmit">
					<text class="sm margin-xs">保存</text>
				</view>
			</block>
		</cu-custom>

		<form>
			<view class="padding-sm">基本信息</view>
			<xg-input title="编码" v-model="params['code']"></xg-input>
			<xg-input title="简称" v-model="params['short_name']"></xg-input>
			<xg-input title="全称" v-model="params['full_name']"></xg-input>
			<xg-input title="电话" v-model="params['tel']"></xg-input>
			<view class="cu-form-group" @click="showMulLinkageThreePicker">
				<view class="title">省/市/区</view>
				<input disabled="true" placeholder="请选择" :value="params['location_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<xg-input title="详细地址" v-model="params['detail_address']"></xg-input>
			<xg-input title="联系人" v-model="params['contact_name']"></xg-input>
			<xg-input title="联系人电话" v-model="params['contact_tel']"></xg-input>
			<view class="cu-form-group" @click="showSinglePicker">
				<view class="title">供应商分类<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['type_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="padding-sm">附加信息</view>
			<xg-input title="邮编" v-model="params['zip_code']"></xg-input>
			<xg-input title="传真" v-model="params['fax']"></xg-input>
			<xg-input title="邮箱" v-model="params['email']"></xg-input>
			<xg-input title="网站" v-model="params['website']"></xg-input>
			<xg-input title="开户行" v-model="params['bank']"></xg-input>
			<xg-input title="开户账号" v-model="params['bank_account']"></xg-input>
			<xg-input title="信用额度" v-model="params['credit_amount']"></xg-input>
		</form>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onTypeConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onCityConfirm"></mpvue-city-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	// import cityData from '@/common/city.data.js';

	export default {
		data() {
			return {
				itemID: null,
				params: {},
				
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#006633',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				pickerSingleArray: []
			}
		},
		components: {
			xgInput,
			mpvuePicker,
			mpvueCityPicker
		},
		onLoad(e) {
			console.log(e)
			// 获取要修改的一条资源
			if(!e.id) {
				uni.redirectTo({
					url:'/pages/index/index'
				})
			}
			this.itemID = e.id
			this.getEditOne()
			this.getTypeList()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'base/suppliers/' + this.itemID,
					success: res => {
						// console.log(res);
						this.params = res.data
						this.cityPickerValueDefault = [this.params.province_id, this.params.city_id, this.params.area_id]
						this.pickerValueDefault = [this.params.type_id]
					}
				});
			},
			getTypeList() {
				api.get({
					url: 'base/supplier/types/all',
					success: res => {
						//console.log(res);
						this.pickerSingleArray = res.data
					}
				});
			},
			// 单列
			showSinglePicker() {
				this.pickerValueArray = this.pickerSingleArray
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			// 二级联动选择
			showMulLinkageTwoPicker() {
				this.pickerValueArray = this.mulLinkageTwoPicker
				this.mode = 'multiLinkageSelector'
				this.deepLength = 2
				this.pickerValueDefault = [0, 0]
				this.$refs.mpvuePicker.show()
			},
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onCancel(e) {
				//console.log(e)
			},
			onTypeConfirm(e) {
				//console.log(e)
				this.params['type_id'] = e.value[0]
				this.$set(this.params, 'type_name', e.label)
			},
			onCityConfirm(e) {
				// console.log(e)
				this.params['province_id'] = e.value[0]
				this.params['city_id'] = e.value[1]
				this.params['area_id'] = e.value[2]
				this.$set(this.params, 'location_name', e.label)
			},
			editSubmit() {
				// console.log(this.params)
				if(this.params['type_id'] == null) {
					uni.showToast({
						icon:"none",
						title:"请选择供应商分类！"
					})
					return;
				}
				api.put({
					url: 'base/suppliers/' + this.itemID,
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
