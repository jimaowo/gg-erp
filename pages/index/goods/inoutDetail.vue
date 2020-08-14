<template>
	<view>
		<cu-custom v-if="showTop" bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">明细</block>
		</cu-custom>

		<form>
			<view class="bg-white padding-sm">
				<view class="flex-sub cf">
					<view class="fl margin-left text-bold">{{params.name}}</view>
					<view class="fr margin-right text-blue">{{params.date}}</view>
				</view>
			</view>
			<view class="flex bg-white text-center">
				<view class="flex-sub solid padding-sm text-bold">颜色</view>
				<view class="flex-sub solid padding-sm text-bold">尺码</view>
				<view class="flex-sub solid padding-sm text-bold">数量</view>
			</view>
			<view v-for="(item, index) in params.detail" :key="index" class="flex bg-white text-center">
				<view class="flex-sub solid padding-sm">{{item.color_name}}</view>
				<view class="flex-sub solid padding-sm">{{item.size_name}}</view>
				<view class="flex-sub solid padding-sm">{{item.count}}</view>
			</view>
			<view class="bg-white padding-sm">
				<view class="flex-sub cf">
					<view class="fl margin-left text-blue">总数:{{params.sum_count}}</view>
					<view class="fr margin-right text-blue">{{params.depot_name}}</view>
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
				itemID: null,
				type: 1,
				pageTitle: '入库',
				CustomBar: this.CustomBar,
				showTop: true,
				searchChooseModal: '',
				searchType: 2,
				keyword: '',
				designList:[],
				searchPlaceholder: '',
				showLoadMore: true,
				loadMoreText: '',
				params: {
					"date": getDate()
				},
				detailList: [],
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
					'depot', 'year', 'design_company', 'style_type'
				],
				date: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end')
			}
		},
		components: {
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			/* this.type = e.type || 1
			if (this.type == 1) {
				this.pageTitle = '入库'
			}
			if (this.type == 2) {
				this.pageTitle = '出库'
			}
			this.getPickerData() */
			if(!e.id) {
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
			this.itemID = e.id
			this.getOneDetail()
		},
		methods: {
			getOneDetail() {
				api.get({
					url: 'home/goods/' + this.itemID,
					success: res => {
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
						'key': '10'
					},
					success: res => {
						this.pickerArray = res.data
					}
				});
			},
			//获取款号列表
			getDesignList() {
				var params = {
					page: this.page,
					status: 3, //只有下发生产的才可以搜到
					keyword: this.keyword
				}
				api.get({
					url: 'home/goods',
					data: params,
					success: res => {
						var newsList = res.data.data;
						console.log(newsList);
						this.page++;
						this.designList = this.designList.concat(newsList);
						if (res.data.current_page == res.data.last_page || res.data.total == 0) {
							this.hasMore = false;
							this.loadMoreText = "没有数据了"
						}
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
				this.boxCount = 0
				this.boxes = ['']
			},
			
			//日期选择
			bindDateChange(e) {
				this.$set(this.params, e.target.id, e.target.value)
			},

			//搜索选择
			showSearchChoose(i) {
				this.searchType = i
				this.page = 1
				this.hasMore = true
				if (i == 2) {
					this.searchPlaceholder = '请输入款号'
					this.designList = []
					this.getDesignList()
				}
				this.searchChooseModal = 'show'
				this.showTop = false
			},
			//搜索框内加载更多数据
			getMoreList() {
				var type = this.searchType
				if (type == 2) {
					this.getDesignList()
				}
			},
			//隐藏模态框
			hideModal(i) {
				if (i == 1) {
					this.purchaseInfoModal = ''
					this.showTop = true
				}
				if (i == 2) {
					if (this.searchType == 2) {
						this.showTop = true
					}
					this.searchChooseModal = ''
				}
				if (i == 3) {
					this.savePurchaseModal = ''
				}
			},
			//获取搜索框关键字
			setKeyword(e) {
				this.keyword = e.detail.value
				this.page = 1
				this.hasMore = true
				this.loadMoreText = "重新加载中...";
				if(this.searchType == 2) {
					this.designList = []
					this.getDesignList()
				}
			},
			//选择款号
			chooseDesign(it) {
				this.params.design_id = it.id
				this.params.name = it.style_code
				this.params.unit_id = it.unit_id
				this.params.unit_name = it.unit_name
				//图片
				if(it.design_img.length > 0) {
					this.params.image = it.design_img[0].img_url
				}
				//按照 尺码x颜色 生成出入库明细
				var sizeIDArr = it.size_ids.split(',')
				var sizeNameArr = it.size_names.split(',')
				var colorIDArr = it.color_ids.split(',')
				var colorNameArr = it.color_names.split(',')
				this.detailList = []
				for(var i in colorIDArr) {
					for(var j in sizeIDArr) {
						var obj = {
							color_id: colorIDArr[i],
							color_name: colorNameArr[i],
							size_id: sizeIDArr[j],
							size_name: sizeNameArr[j],
							count: 0
						}
						this.detailList.push(obj)
					}
				}
				this.hideModal(2)
			},
			//统一设置数量
			setAllCount(e)
			{
				var v = parseFloat(e.detail.value||0), sum_count = 0;
				for (var i = 0, lenI = this.detailList.length; i < lenI; ++i) {
					this.detailList[i].count = v
					sum_count += v
				}
				this.params.sum_count = sum_count
			},

			addSubmit() {
				console.log(this.params)
				console.log(this.detailList)
				this.params.type = this.type
				var sum_count = 0;
				for (var i = 0, lenI = this.detailList.length; i < lenI; ++i) {
					sum_count += parseFloat(this.detailList[i].count)
				}
				this.params.sum_count = sum_count
				this.params.detail = JSON.stringify(this.detailList)

				api.post({
					url: 'home/goods',
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
