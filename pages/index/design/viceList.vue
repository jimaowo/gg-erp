<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">辅料</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="goToAdd">
					<text class="margin-xs text-xl">添加辅料</text>
				</view>
			</block>
		</cu-custom>

		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="text-left">
					<form>
						<view class="cu-form-group" @click="showSinglePicker(14)">
							<view class="title">供应商<text class="text-red">*</text></view>
							<input disabled="true" placeholder="请选择" :value="params['supplier_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="grid col-2">
							<xg-input title="名称" required=true v-model="params['name']"></xg-input>
							<xg-input title="规格" v-model="params['specification']"></xg-input>
							<xg-input title="货号" v-model="params['item_no']"></xg-input>
							<xg-input title="色码" v-model="params['color_no']"></xg-input>
							<view class="cu-form-group" @click="showSinglePicker(6)">
								<view class="title">单位<text class="text-red">*</text></view>
								<input disabled="true" placeholder="请选择" :value="params['unit_name']"></input>
								<text class="cuIcon-right"></text>
							</view>
							<xg-input title="幅宽" v-model="params['width']"></xg-input>
							<xg-input title="单价" v-model="params['price']"></xg-input>
							<xg-input title="单件用量" v-model="params['single_count']"></xg-input>
							<xg-input title="备注" v-model="params['remarks']"></xg-input>
						</view>
					</form>
				</view>

				<view class="cu-bar bg-white tabbar border shop">
					<view class="bg-orange submit" @tap="hideModal">取消</view>
					<view class="bg-green submit" @tap="saveMain">保存</view>
				</view>
			</view>
		</view>

		<!-- 列表数据 -->
		<view>
			<scroll-view scroll-x="true">
				<!-- 表头 -->
				<view class="gg-scroll-view text-white">
					<view class="gg-scroll-th td-a">操作（向右滑动）</view>
					<view class="gg-scroll-th td-b">供应商</view>
					<view class="gg-scroll-th td-b">名称</view>
					<view class="gg-scroll-th">货号</view>
					<view class="gg-scroll-th">色码</view>
					<view class="gg-scroll-th">规格</view>
					<view class="gg-scroll-th">单位</view>
					<view class="gg-scroll-th">幅宽</view>
					<view class="gg-scroll-th">单价</view>
					<view class="gg-scroll-th td-c">单件用量</view>
					<view class="gg-scroll-th td-c">备注</view>
				</view>

				<view class="gg-scroll-view text-black" v-for="(item,index) in listData" :key="index">
					<view class="gg-scroll-td td-a">
						<button class="cu-btn sm line-blue margin-left-xs" @tap="goToEdit(item.id)">修改</button>
						<button class="cu-btn sm line-gpink margin-left-xs" @tap="ggDelete(item.id)">删除</button>
					</view>
					<view class="gg-scroll-td td-b">{{item.supplier_name}}</view>
					<view class="gg-scroll-td td-b">{{item.name}}</view>
					<view class="gg-scroll-td">{{item.item_no||'-'}}</view>
					<view class="gg-scroll-td">{{item.color_no || '-'}}</view>
					<view class="gg-scroll-td">{{item.specification || '-'}}</view>
					<view class="gg-scroll-td">{{item.unit_name}}</view>
					<view class="gg-scroll-td">{{item.width || '-'}}</view>
					<view class="gg-scroll-td">{{item.price || '-'}}</view>
					<view class="gg-scroll-td td-c">{{item.single_count || '-'}}</view>
					<view class="gg-scroll-td td-c">{{item.remarks || '-'}}</view>
				</view>

			</scroll-view>

		</view>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
	import uniBadge from '@/components/uni-badge/uni-badge.vue'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				design_id: null,
				listData: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				page: 1,
				hasMore: true,
				showPop: false,
				sort: '',
				// 搜索相关
				params: {},
				type_label: '',
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
					'depots', 'year', 'design_company', 'style_type', 'supplier'
				]
			}
		},
		components: {
			uniPopup,
			xgInput,
			mpvuePicker,
			uniBadge
		},
		onLoad(e) {
			this.design_id = e.did
			this.getList()
			this.getPickerData()
		},
		methods: {
			/**
			 * 加载数据列表
			 */
			getList: function() {
				api.get({
					url: 'home/design/materials',
					data: {
						design_id: this.design_id,
						is_main: 2
					},
					success: res => {
						this.listData = res.data;
					}
				});
			},
			//获取选择所需数据
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depots
				//11.year 12.design_company 13.style_type 14.supplier
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '14,6'
					},
					success: res => {
						this.pickerArray = res.data
					}
				});
			},
			togglePopup() {
				this.showPop = !this.showPop;
			},
			changeSort(e) {
				this.sort = e
				this.reloadMyData()
				this.togglePopup()
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
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
			onSingleConfirm(e) {
				console.log(e)
				var k = this.pickerKey
				var key = this.xgArray[k]
				this.params[key + '_id'] = e.value[0]
				this.$set(this.params, key + '_name', e.label)
			},
			goToAdd() {
				this.itemID = null
				this.params = {}
				this.modalName = 'bottomModal'
			},
			goToEdit(id) {
				this.itemID = id
				this.params = {}
				api.get({
					url: 'home/design/materials/' + id,
					success: res => {
						this.params = res.data
					}
				});
				this.modalName = 'bottomModal'
			},
			goToMatch() {
				this.itemID = null
				this.params = {}
				this.params.is_match_color = 2
				this.modalName = 'bottomModal'
			},
			//保存主料
			saveMain() {
				var apiUrl = "home/design/materials"
				var method = "POST"
				if (this.itemID) {
					apiUrl = "home/design/materials/" + this.itemID
					method = "PUT"
				}
				this.params.design_id = this.design_id
				this.params.is_main = 2
				api.request({
					url: apiUrl,
					method: method,
					data: this.params,
					success: data => {
						console.log(data);
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						if (data.code == 1) {
							this.getList()
							this.modalName = null
						}
					}
				});
			},
			//删除资源
			ggDelete(id) {
				var deleteUrl = 'home/design/materials/' + id
				api.ggDelete(deleteUrl, this.getList)
			}
		}
	}
</script>


<style lang="scss">
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.gg-scroll-view {
		white-space: nowrap;
		width: 100%;
	}

	.gg-scroll-th {
		display: inline-block;
		width: 100upx;
		text-align: center;
		font-size: 36upx;
		background-color: #1cbbb4;
		color: #ffffff;
		border: 1upx solid rgba(0, 0, 0, 0.1);
		padding: 10upx;
	}

	.gg-scroll-td {
		display: inline-block;
		width: 100upx;
		text-align: center;
		font-size: 36upx;
		background-color: #ffffff;
		color: #666666;
		border: 1upx solid rgba(0, 0, 0, 0.1);
		padding: 10upx;
	}

	.td-a {
		width: 300upx;
	}

	.td-b {
		width: 160upx;
	}

	.td-c {
		width: 180upx;
	}
</style>
