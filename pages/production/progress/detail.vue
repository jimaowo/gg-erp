<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">生产进度</block>
		</cu-custom>

		<view class="flex solids-bottom bg-white padding-sm">
			<view class="flex-sub">
				<view class="grid col-1 grid-square padding-top">
					<view class="bg-img" v-if="params['design_img']!==undefined && params['design_img'].length>0" :style="[{ backgroundImage:'url(' + params['design_img'][0] + ')' }]"></view>
				</view>
			</view>
			<view class="flex-treble">
				<view class="flex">
					<view class="flex-sub cf padding-sm">
						<view class="fl text-bold text-xl">款号:{{params.style_code}}</view>
						<view class="fr text-bold text-red">第1单</view>
					</view>
				</view>
				<view class="flex margin-left-sm">
					<view class="flex-sub text-lg">款名:{{params.style_name}}</view>
				</view>
				<view class="flex margin-left-sm">
					<view class="flex-sub text-lg">尺码:{{params.size_names}}</view>
				</view>
			</view>
		</view>
		
		<view class="flex bg-white padding-sm text-center">
			<view class="flex-sub">
				<view class="cu-btn">上一床</view>
			</view>
			<view class="flex-twice">
				<view class="text-red text-xs">第一床</view>
				<view class="text-xs">下单时间：2019-07-17</view>
			</view>
			<view class="flex-sub">
				<view class="cu-btn">下一床</view>
			</view>
		</view>
		
		<view class="padding-sm bg-white solid-bottom">
			<view class="flex bg-gpink radius text-center">
				<view class="flex-sub">时间</view>
				<view class="flex-sub">环节</view>
				<view class="flex-sub">数量</view>
			</view>
		</view>
		
		<!-- 时间线 -->
		<view v-for="(item,index) in progressList" :key="index" class="flex text-center bg-white">
			<view class="flex-sub">
				<view>开：{{item.create_time}}</view>
				<view v-if="item.finish_time!=''">完：{{item.finish_time}}</view>
			</view>
			<view class="flex-sub">
				<view class="cu-timeline">
					<view class="cu-item text-black">{{item.name}}</view>
				</view>
			</view>
			<view class="flex-sub">
				<view>{{item.create_count}}</view>
			</view>
		</view>

	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "请选择",
				params: {
					"year_name": '2019',
					"design_img": []
				},
				progressList: [],
				cityPickerValueDefault: [0, 0, 0],
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
				],
				imgList: []
			}
		},
		components: {
			xgInput
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
			this.getProgress()
			//this.getPickerData()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'home/designs/' + this.itemID,
					success: res => {
						this.params = res.data
					}
				});
			},
			getProgress() {
				api.get({
					url: 'home/progress',
					data: {
						design_id: this.itemID
					},
					success: res => {
						this.progressList = res.data
					}
				});
			},
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depots
				//11.year 12.design_company 13.style_type
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '11,12,13,5,2,6,1,3,4'
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
				this.pickerValueArray = this.pickerArray[this.xgArray[k]]
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
			onSingleConfirm(e) {
				console.log(e)
				var k = this.pickerKey
				var key = this.xgArray[k]
				this.params[key + '_id'] = e.value[0]
				this.$set(this.params, key + '_name', e.label)
			},
			onCityConfirm(e) {
				// console.log(e)
				this.params['province_id'] = e.value[0]
				this.params['city_id'] = e.value[1]
				this.params['area_id'] = e.value[2]
				this.$set(this.params, 'location_name', e.label)
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
			//选择选项
			CheckboxChange(e) {
				var items = this.checkbox,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values.includes(item.value + '')) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
			},
			cancelChoose() {
				this.modalName = null
			},
			//选择提交
			chooseSubmit() {
				var items = this.checkbox;
				var idArr = [];
				var nameArr = [];
				if (items !== undefined) {
					for (var i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i]
						if (item.checked) {
							idArr.push(item.value)
							nameArr.push(item.label)
						}
					}
				}

				console.log(idArr)
				console.log(nameArr)
				//选择后设置输入框值
				var key = this.xgArray[this.pickerKey]
				this.$set(this.params, key + '_ids', idArr.join(','))
				this.$set(this.params, key + '_names', nameArr.join(','))
				this.modalName = null
			},

			//日期选择
			bindDateChange(e) {
				console.log(e)
				this.$set(this.params, e.target.id, e.target.value)
			},

			//图片选择
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					//sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					//sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res)
						api.uploadFile({
							url: 'home/upload/one',
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								console.log(uploadFileRes)
								this.params.design_img = this.params.design_img.concat(uploadFileRes.data)
							}
						})
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
						console.log(this.imgList)
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				console.log(this.params.design_img)
				console.log(this.imgList)
				uni.showModal({
					content: '确定要删除这张图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							var k = e.currentTarget.dataset.index
							/* console.log(this.params.design_img[k])
							api.delete({
								url: 'home/upload/del',
								data: {'file_name':this.params.design_img[k]},
								success: (delRes) => {
									console.log(delRes)
								}
							}) */
							this.params.design_img.splice(k, 1)
							this.imgList.splice(k, 1)
						}
					}
				})
			},

			editSubmit() {
				console.log(this.params)
				api.put({
					url: 'home/designs/' + this.itemID,
					data: this.params,
					success: res => {
						console.log(res);
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

	.scroll-Y {
		height: 800upx;
	}
</style>
