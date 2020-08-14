<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">创建设计单</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="addSubmit">
					<text class="margin-xs text-xl">保存</text>
				</view>
			</block>
		</cu-custom>

		<form>
			<view class="padding-sm">基本信息</view>
			<view class="cu-form-group" @click="showSinglePicker(11)">
				<view class="title">年份<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['year_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(12)">
				<view class="title">设计单位<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['design_company_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(13)">
				<view class="title">款式类别<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['style_type_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(5)">
				<view class="title">季节<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['season_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(2)">
				<view class="title">品牌<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['brand_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showSinglePicker(6)">
				<view class="title">单位<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['unit_name']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showPickerModal(4)">
				<view class="title">制作工艺<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['process_names']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showPickerModal(3)">
				<view class="title">尺码<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['size_names']"></input>
				<text class="cuIcon-right"></text>
			</view>
			<view class="cu-form-group" @click="showPickerModal(1)">
				<view class="title">颜色<text class="text-red">*</text></view>
				<input disabled="true" placeholder="请选择" :value="params['color_names']"></input>
				<text class="cuIcon-right"></text>
			</view>

			<view class="cu-form-group">
				<view class="title">裁床日期</view>
				<picker mode="date" :value="params['cutting_bed_date']" :start="startDate" :end="endDate" id="cutting_bed_date"
				 @change="bindDateChange">
					<view class="picker">
						{{params['cutting_bed_date']}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">完成日期</view>
				<picker mode="date" :value="params['finish_date']" :start="startDate" :end="endDate" id="finish_date" @change="bindDateChange">
					<view class="picker">
						{{params['finish_date']}}
					</view>
				</picker>
			</view>

			<xg-input title="款号" required=true v-model="params['style_code']"></xg-input>
			<xg-input title="款名" required=true v-model="params['style_name']"></xg-input>
			<xg-input title="成份" v-model="params['element']"></xg-input>
			<xg-input title="备注" v-model="params['remarks']"></xg-input>

			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
		</form>

		<!-- 多选模态框 -->
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{modalTitle}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<scroll-view scroll-y="true" class="bg-white scroll-Y">
					<view class="grid col-3 margin-bottom padding">
						<view v-for="(item,index) in boxes" :key="index" @tap="addBox(index)">
							<view class="solid padding-xs margin-xs" :class="index<boxCount?'line-blue':''">
								<input type="text" v-model="boxes[index]" :placeholder="index>=boxCount?'添加':''" />
							</view>
						</view>
					</view>
					<checkbox-group class="block" @change="CheckboxChange">
						<view class="grid col-3">
							<view class="padding-sm" v-for="(item,index) in checkbox" :key="item.value">
								<label class="text-lg">
									<checkbox class='round blue' :class="checkbox[index].checked?'checked':''" :checked="checkbox[index].checked?true:false"
									 :value="item.value+''"></checkbox>{{item.label}}
								</label>
							</view>
						</view>
					</checkbox-group>
				</scroll-view>
				<view class="cu-bar bg-white justify-center">
					<view class="action">
						<button class="cu-btn line-gold text-gold" @tap="cancelChoose">取消</button>
						<button class="cu-btn bg-gold margin-left" @tap="chooseSubmit">确定</button>
					</view>
				</view>
			</view>
		</view>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onCityConfirm"></mpvue-city-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
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
				params: {
					"year_name": '2019',
					"finish_date": getDate(),
					"cutting_bed_date": getDate(),
					"design_img": []
				},
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
				date: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),
				imgList: [],
				boxes: [''],
				boxCount: 0,
				addBoxUrl:{
					1:'base/colors',
					3:'base/sizes',
					4:'base/processes',
				}
			}
		},
		components: {
			xgInput,
			mpvuePicker,
			mpvueCityPicker
		},
		onLoad() {
			this.getPickerData()
		},
		methods: {
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
				this.boxCount = 0
				this.boxes = ['']
			},
			hideModal(e) {
				this.modalName = null
			},
			//添加box
			addBox(i) {
				if(i>=1 && this.boxes[i-1] == '') {
					uni.showToast({
						icon: 'none',
						title: '名称不能为空'
					});
					return;
				}
				if (i >= this.boxCount) {
					this.boxes.push('')
					this.boxCount++
				}
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
				var key = this.xgArray[this.pickerKey];
				var items = this.checkbox;
				var idArr = [];
				var nameArr = [];
				//请求添加
				var addUrl = this.addBoxUrl[this.pickerKey]
				for(var a = 0; a < this.boxCount; a++){
					api.post({
						url: addUrl,
						data: {"name":this.boxes[a]},
						success: res => {
							if (res.code == 1) {
								var obj = {
									label: res.data.name,
									value: res.data.id,
									checked: true
								}
								this.pickerArray[key].push(obj)
								idArr.push(res.data.id)
								nameArr.push(res.data.name)
								if(a == this.boxCount) {
									console.log(idArr)
									//选择后设置输入框值
									this.$set(this.params, key + '_ids', idArr.join(','))
									this.$set(this.params, key + '_names', nameArr.join(','))
								}
							}
						}
					});
				}
				
				if (items !== undefined) {
					for (var i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i]
						if (item.checked) {
							idArr.push(item.value)
							nameArr.push(item.label)
						}
					}
				}
				//选择后设置输入框值
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
				console.log(e)
				uni.showModal({
					content: '确定要删除这张图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							var k = e.currentTarget.dataset.index
							console.log(this.params.design_img[k])
							api.delete({
								url: 'home/upload/del',
								data: {
									'file_name': this.params.design_img[k]
								},
								success: (delRes) => {
									console.log(delRes)
								}
							})
							this.params.design_img.splice(k, 1)
							this.imgList.splice(k, 1)
						}
					}
				})
			},

			addSubmit() {
				console.log(this.params)
				this.params.year = this.params.year_name

				api.post({
					url: 'home/designs',
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
		height: 650upx;
	}
</style>
