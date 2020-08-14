<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">收货单明细</block>
		</cu-custom>

		<form>
			<view class="padding-sm">收货信息</view>
			<view class="cu-form-group">
				<view class="title">单号</view>
				<input disabled="true" :value="params['code']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">款号</view>
				<input disabled="true" :value="params['style_code']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">外协名称</view>
				<input disabled="true" :value="params['association_name']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">联系人</view>
				<input disabled="true" :value="params['contact_name']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">联系电话</view>
				<input disabled="true" :value="params['contact_tel']"></input>
			</view>

			<view class="padding-sm">收货明细</view>
			<view class="flex text-center bg-white text-bold">
				<view class="flex-twice padding-sm solid">收货日期</view>
				<view class="flex-sub padding-sm solid">颜色</view>
				<view class="flex-sub padding-sm solid">实收</view>
				<view class="flex-sub padding-sm solid">残次品</view>
				<view class="flex-sub padding-sm solid">返工</view>
				<view class="flex-sub padding-sm solid">备注</view>
			</view>
			<view v-for="(detail,index) in params.get_detail" :key="index" class="flex text-center bg-white">
				<view class="flex-twice padding-sm solid text-xs">{{detail.create_time}}</view>
				<view class="flex-sub padding-sm solid">{{detail.color_name}}</view>
				<view class="flex-sub padding-sm solid">{{parseFloat(detail.get_count)}}</view>
				<view class="flex-sub padding-sm solid">{{parseFloat(detail.bad_count)}}</view>
				<view class="flex-sub padding-sm solid">{{parseFloat(detail.back_count)}}</view>
				<view class="flex-sub padding-sm solid">{{detail.remarks}}</view>
			</view>
			<view class="flex text-center bg-white">
				<view class="flex-twice padding-sm solid">合计</view>
				<view class="flex-sub padding-sm solid">-</view>
				<view class="flex-sub padding-sm solid">{{params.get_count}}</view>
				<view class="flex-sub padding-sm solid">{{params.bad_count}}</view>
				<view class="flex-sub padding-sm solid">{{params.back_count}}</view>
				<view class="flex-sub padding-sm solid">--</view>
			</view>

		</form>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>

	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 10;
		} else if (type === 'end') {
			year = year + 5;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}

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
					'depots', 'year', 'design_company', 'style_type', 'supplier', 'style_code', 'buyer', 'produce_company'
				],
				startDate: getDate('start'),
				endDate: getDate('end'),
				imgList: [],
				picList: [],
				infoTab: 1,
				radio: null
			}
		},
		components: {
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			// 获取要修改的一条资源
			if (!e.id) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
			this.itemID = e.id
			this.getEditOne()
			//this.getPickerData()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'home/gets/' + this.itemID,
					success: res => {
						this.params = res.data
						//计算合计值
						var sumA = 0, sumB = 0, sumC = 0;
						var detais = res.data.get_detail;
						for(var i=0, len=detais.length; i<len; i++) {
							sumA += parseFloat(detais[i].get_count)
							sumB += parseFloat(detais[i].bad_count)
							sumC += parseFloat(detais[i].back_count)
						}
						this.params.get_count = sumA
						this.params.bad_count = sumB
						this.params.back_count = sumC
					}
				});
			},
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depot
				//11.year 12.design_company 13.style_type 14.supplier 15.style_code 16.buyer 17.produce_company
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '17'
					},
					success: res => {
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
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onCancel(e) {
				//console.log(e)
			},
			onSingleConfirm(e) {
				var k = this.pickerKey
				var key = this.xgArray[k]
				this.params[key + '_id'] = e.value[0]
				this.$set(this.params, key + '_name', e.label)
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

			//日期选择
			bindDateChange(e) {
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
								this.params.plan_pic = this.params.plan_pic.concat(uploadFileRes.data)
							}
						})
						if (this.picList.length != 0) {
							this.picList = this.picList.concat(res.tempFilePaths)
						} else {
							this.picList = res.tempFilePaths
						}
						console.log(this.picList)
					}
				});
			},
			ViewImage(e) {
				var urls = this.imgList
				if (this.infoTab == 2) {
					urls = this.picList
				}
				uni.previewImage({
					urls: urls,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				console.log(this.picList)
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
							this.params.plan_pic.splice(k, 1)
							this.picList.splice(k, 1)
						}
					}
				})
			},
			//单选任务类型
			RadioChange(e) {
				this.radio = e.detail.value
				this.params.type = e.detail.value
			},

			//切换信息栏
			changeInfoTab(tag) {
				this.infoTab = tag
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
