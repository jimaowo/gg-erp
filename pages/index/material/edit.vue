<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">修改物料</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="editSubmit">
					<text class="margin-xs text-xl">保存</text>
				</view>
			</block>
		</cu-custom>

		<form>
			<view class="padding-sm">基本信息</view>
		
			<xg-input title="编码" v-model="params['code']"></xg-input>
			<xg-input title="名称" v-model="params['name']"></xg-input>
			<xg-input title="货号" v-model="params['item_no']"></xg-input>
			<xg-input title="色号" v-model="params['color_no']"></xg-input>
			<xg-input title="规格" v-model="params['specification']"></xg-input>
		
			<view class="cu-form-group" @click="showSinglePicker(14)">
				<view class="title">供应商<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['supplier_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(9)">
				<view class="title">分类<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['material_type_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
		
			<view class="cu-form-group" @click="showSinglePicker(1)">
				<view class="title">颜色</view>
				<input disabled="true" placeholder="请选择" :value="params['color_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(6)">
				<view class="title">单位<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['unit_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(99)">
				<view class="title">是否主布</view>
				<input disabled="true" placeholder="请选择" :value="params['is_main_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
		
			<view class="padding-sm">附加信息</view>
			<xg-input title="条形码" v-model="params['bar_code']"></xg-input>
			<xg-input title="幅宽" v-model="params['width']"></xg-input>
			<xg-input title="全称" v-model="params['full_name']"></xg-input>
			<xg-input title="备注" v-model="params['remarks']"></xg-input>
		</form>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "请选择",
				params: {},
				themeColor: '#006633',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				pickerSingleArray: [],
				pickerArray: [],
				pickerKey: 1,
				checkbox: [],
				xgArray: ['', 'color', 'brand', 'size', 'process', 'season', 'unit', 'production', 'level', 'material_type',
					'depots', 'year', 'design_company', 'style_type'
				]
			}
		},
		components: {
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			// 获取要修改的一条资源
			if(!e.id) {
				uni.redirectTo({
					url:'/pages/index/index'
				})
			}
			this.itemID = e.id
			this.getEditOne()
			this.getPickerData()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'home/materials/' + this.itemID,
					success: res => {
						console.log(res);
						this.params = res.data
					}
				});
			},
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depots
				//11.year 12.design_company 13.style_type
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '14,9,1,6'
					},
					success: res => {
						console.log(res);
						this.pickerArray = res.data
					}
				});
			},
			// 单列
			showSinglePicker(k) {
				this.pickerKey = k
				if (k == 99) {
					this.pickerValueArray = [{label:'主料',value:1},{label:'辅料',value:2}]
				} else {
					this.pickerValueArray = this.pickerArray[this.xgArray[k]]
				}
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onCancel(e) {
				//console.log(e)
			},
			onSingleConfirm(e) {
				var k = this.pickerKey
				if (k == 99) {
					this.params['is_main'] = e.value[0]
					this.$set(this.params, 'is_main_name', e.label)
				} else {
					var key = this.xgArray[k]
					this.params[key + '_id'] = e.value[0]
					this.$set(this.params, key + '_name', e.label)
				}
			},
			//多选模态框
			showPickerModal(k) {
				this.pickerKey = k
				this.checkbox = this.pickerArray[this.xgArray[k]]
				this.modalName = "DialogModal1"
			},
			hideModal(e) {
				this.modalName = null
			},

			editSubmit() {
				api.put({
					url: 'home/materials/' + this.itemID,
					data: this.params,
					success: res => {
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

	.scroll-Y {
		height: 800upx;
	}
</style>
