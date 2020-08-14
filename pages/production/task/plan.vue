<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">任务安排</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="planSubmit">
					<text class="margin-xs text-xl">提交计划</text>
				</view>
			</block>
		</cu-custom>

		<form>
			<view class="cu-form-group">
				<view class="title">款号</view>
				<input disabled="true" :value="params['style_code']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">下发总数</view>
				<input disabled="true" :value="params['order_count']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">交货日期</view>
				<!-- <input disabled="true" :value="params['submit_date']"></input> -->
				<picker mode="date" :value="params['submit_date']" :start="startDate" :end="endDate" id="submit_date" @change="bindDateChange">
					<view class="picker">
						{{params['submit_date']}}
					</view>
				</picker>
			</view>
			
			<view class="padding-sm">任务信息</view>
			<view class="cu-form-group" @click="showSinglePicker(17)">
				<view class="title">生产单位<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['produce_company_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<xg-input title="制作工艺" v-model="params['process']"></xg-input>
			<xg-input title="备注" v-model="params['remarks']"></xg-input>
			<view class="cu-form-group">
			<radio-group class="block" @change="RadioChange">
				<view class="flex">
					<view class="flex-sub">
						<radio class='blue radio' :class="radio==1?'checked':''" :checked="radio==1?true:false" value="1">本厂</radio>
					</view>
					<view class="flex-sub">
						<radio class='blue radio' :class="radio==2?'checked':''" :checked="radio==2?true:false" value="2">外协</radio>
					</view>
					<view class="flex-sub">
						<radio class='blue radio' :class="radio==3?'checked':''" :checked="radio==3?true:false" value="3">本厂+外协</radio>
					</view>
				</view>
			</radio-group>
				</view>
			<view class="padding-sm">计划安排</view>
			<view class="flex text-center bg-white text-bold">
				<view class="flex-sub padding-sm solid">颜色</view>
				<view class="flex-twice padding-sm solid">实裁数量</view>
				<view class="flex-twice padding-sm solid">下发数量</view>
				<view class="flex-twice padding-sm solid">计划数量</view>
			</view>
			<view v-for="(detail,index) in params.task_detail" :key="index" class="flex text-center bg-white">
				<view class="flex-sub padding-sm solid">{{detail.color_name}}</view>
				<view class="flex-twice padding-sm solid">{{detail.true_count}}</view>
				<view class="flex-twice padding-sm solid">{{detail.order_count}}</view>
				<view class="flex-twice padding-sm solid">
					<input class="solids" type="text" v-model="detail['plan_count']" />
				</view>
			</view>
			<view class="flex text-center bg-white">
				<view class="flex-sub padding-sm solid">合计</view>
				<view class="flex-twice padding-sm solid">{{params.true_count}}</view>
				<view class="flex-twice padding-sm solid">{{params.order_count}}</view>
				<view class="flex-twice padding-sm solid"> -- </view>
			</view>
			
			<view class="flex text-center">
				<view class="flex-sub padding-sm" :class="infoTab==1?'solids-bottom text-blue line-blue':''" @tap="changeInfoTab(1)">图片</view>
				<view class="flex-sub padding-sm" :class="infoTab==2?'solids-bottom text-blue line-blue':''" @tap="changeInfoTab(2)">工艺单</view>
			</view>
			
			<view v-show="infoTab==1">
				<view class="cu-bar bg-white">
					<view class="action">
						图片
					</view>
					<view class="action">
						{{imgList.length}}张
					</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			
			<view v-show="infoTab==2">
				<view class="cu-bar bg-white">
					<view class="action">
						工艺单上传
					</view>
					<view class="action">
						{{picList.length}}/4
					</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in picList" :key="index" @tap="ViewImage" :data-url="picList[index]">
							<image :src="picList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="picList.length<4">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
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
					url: 'home/tasks/' + this.itemID,
					success: res => {
						console.log(res.data)
						this.params = {
							design_id: res.data.design_id,
							task_id: res.data.id,
							style_code: res.data.style_code,
							order_count: res.data.order_count,
							submit_date: getDate(),
							task_detail: res.data.task_detail,
							plan_pic: []
						}
						var sum_true_count = 0, sum_order_count = 0, sum_plan_count = 0;
						for (var i = 0, len = res.data.task_detail.length; i < len; i++) {
							//设置默认的计划数量
							this.params.task_detail[i].plan_count = res.data.task_detail[i].order_count
							//求合计
							sum_true_count += parseFloat(this.params.task_detail[i].true_count)
							sum_order_count += parseFloat(this.params.task_detail[i].order_count)
						}
						this.params.order_count = sum_order_count.toFixed(2)
						this.params.true_count = sum_true_count.toFixed(2)
						this.imgList = res.data.design.design_img
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
				if(this.infoTab == 2) {
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
			},
			
			//提交计划
			planSubmit() {
				console.log(this.params)
				var params = this.params
				params.details = JSON.stringify(this.params.task_detail)
				var sum_plan_count = 0
				for (var i = 0, len = params.task_detail.length; i < len; i++) {
					sum_plan_count += parseFloat(params.task_detail[i].plan_count)
				}
				params.plan_count = sum_plan_count
				
				api.post({
					url: 'home/plans',
					data: params,
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
