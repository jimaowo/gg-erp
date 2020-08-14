<template>
	<view>
		<cu-custom v-if="showTop" bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">外协收发</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="getHistory">
					<text class="margin-xs text-xl">收货历史</text>
				</view>
			</block>
		</cu-custom>

		<form>
			<view class="flex text-center">
				<view class="flex-sub padding-sm" :class="infoTab==1?'solids-bottom text-blue line-blue':''" @tap="changeInfoTab(1)">发货</view>
				<view class="flex-sub padding-sm" :class="infoTab==2?'solids-bottom text-blue line-blue':''" @tap="changeInfoTab(2)">收货</view>
			</view>

			<view v-show="infoTab==1&&showTop==true">
				<view class="cu-form-group">
					<view class="title">款号</view>
					<input disabled="true" :value="params['style_code']"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">制作工艺</view>
					<input disabled="true" :value="params['process']"></input>
				</view>
				<view class="cu-form-group" @click="showSinglePicker(7)">
					<view class="title">生产类型<text class="text-red">*</text></view>
					<input disabled="true" placeholder="请选择" :value="params['production_name']"></input>
					<text class="cuIcon-right"></text>
				</view>
				<view class="cu-form-group" @click="showSinglePicker(18)">
					<view class="title">外协<text class="text-red">*</text></view>
					<input disabled="true" placeholder="请选择" :value="params['association_name']"></input>
					<text class="cuIcon-right"></text>
				</view>
				<xg-input title="工价" v-model="params['wages']"></xg-input>
				<view class="cu-form-group">
					<view class="title">发货日期</view>
					<picker mode="date" :value="params['send_date']" :start="startDate" :end="endDate" id="send_date" @change="bindDateChange">
						<view class="picker">
							{{params['send_date']}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">交货日期</view>
					<picker mode="date" :value="params['turn_date']" :start="startDate" :end="endDate" id="turn_date" @change="bindDateChange">
						<view class="picker">
							{{params['turn_date']||'请选择'}}
						</view>
					</picker>
				</view>
				<xg-input title="备注" v-model="params['remarks']"></xg-input>

				<view class="solids-top"></view>
				<view class="flex text-center bg-white">
					<view class="flex-sub padding-sm solid text-bold">颜色</view>
					<view class="flex-sub padding-sm solid text-bold">裁床数</view>
					<view class="flex-sub padding-sm solid text-bold">可发数</view>
					<view class="flex-sub padding-sm solid text-bold">本次发货</view>
				</view>
				<view v-for="(detail,index) in params.plan_detail" :key="index" class="flex text-center bg-white">
					<view class="flex-sub padding-sm solid">{{detail.color_name}}</view>
					<view class="flex-sub padding-sm solid">{{parseFloat(detail.true_count).toFixed()}}</view>
					<view class="flex-sub padding-sm solid">{{detail.can_send}}</view>
					<view class="flex-sub padding-sm solid">
						<input class="solids" type="text" v-model="detail['send_count']" />
					</view>
				</view>
				<view class="margin-top-xxl">gg</view>
				<view class="cu-bar bg-white tabbar border shop foot">
					<view class="bg-orange submit" @tap="BackPage">取消</view>
					<view class="bg-green submit" @tap="sendSubmit">发货</view>
				</view>
			</view>

			<view v-show="infoTab==2">
				<view v-if="sendDetail.length>0" v-for="(send,index) in sendDetail" :key="index">
					<view class="bg-white text-center padding-sm solid">{{send.association_name}}/{{send.send_date}}</view>
					<view class="flex text-center bg-white">
						<view class="flex-sub padding-sm solid text-bold">颜色</view>
						<view class="flex-sub padding-sm solid text-bold">已发</view>
						<view class="flex-sub padding-sm solid text-bold">已收</view>
						<view class="flex-sub padding-sm solid text-bold">未收</view>
						<view class="flex-treble padding-sm solid text-bold">操作</view>
					</view>
					<view v-for="(sd,ix) in send.send_detail" :key="ix" class="flex text-center bg-white">
						<view class="flex-sub padding-sm solid">{{sd.color_name}}</view>
						<view class="flex-sub padding-sm solid">{{parseFloat(sd.send_count).toFixed()}}</view>
						<view class="flex-sub padding-sm solid">{{parseFloat(sd.receive_count).toFixed()}}</view>
						<view class="flex-sub padding-sm solid">{{parseFloat(sd.send_count)-parseFloat(sd.receive_count)}}</view>
						<view class="flex-treble padding-sm solid">
							<text v-if="sd.status==2">已结单</text>
							<button v-if="sd.status==1" class="cu-btn sm line-green margin-xs" @tap="goToGet(sd, send)">收货</button>
							<button v-if="sd.status==1" class="cu-btn sm line-red margin-xs" @tap="confirmFinish(sd.id)">结单</button>
						</view>
					</view>
				</view>
			</view>
			
		</form>
		
		<!-- 底部收货模态框 -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="text-left">
					<form>
						<view class="cu-form-group">
							<view class="title">款号</view>
							<input disabled="true" :value="getParams['style_code']"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">颜色</view>
							<input disabled="true" :value="getParams['color_name']"></input>
						</view>
						
						<view class="cu-form-group">
							<view class="title">实收</view>
							<input v-model="getParams['get_count']"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">残次品</view>
							<input v-model="getParams['bad_count']" placeholder="0"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">返工</view>
							<input v-model="getParams['back_count']" placeholder="0"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">出厂日期</view>
							<picker mode="date" :value="getParams['done_date']" :start="startDate" :end="endDate" id="done_date" @change="getDateChange">
								<view class="picker">
									{{getParams['done_date']||'请选择'}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group">
							<view class="title">返工日期</view>
							<picker mode="date" :value="getParams['back_date']" :start="startDate" :end="endDate" id="back_date" @change="getDateChange">
								<view class="picker">
									{{getParams['back_date']||'请选择'}}
								</view>
							</picker>
						</view>
						<xg-input title="备注" v-model="getParams['remarks']"></xg-input>
					</form>
				</view>
				<view class="cu-bar bg-white tabbar border shop">
					<view class="bg-orange submit" @tap="hideModal">取消</view>
					<view class="bg-green submit" @tap="getSubmit">收货</view>
				</view>
			</view>
		</view>
		
		<!-- 收货历史模态框 -->
		<view class="cu-modal bottom-modal" :class="getHistoryModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action cuIcon-close" @tap="hideModal(1)"></view>
					<view class="content text-bold">收货历史</view>
				</view>
				<scroll-view scroll-y="true" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
					<view v-if="receiveDetail.length>0" v-for="(receive,index) in receiveDetail" :key="index">
						<view class="bg-white text-center padding-sm solid">{{receive.code}}/{{receive.association_name}}</view>
						<view class="flex text-center bg-white">
							<view class="flex-sub padding-sm solid text-bold text-xs">颜色</view>
							<view class="flex-sub padding-sm solid text-bold text-xs">实收</view>
							<view class="flex-sub padding-sm solid text-bold text-xs">残次品</view>
							<view class="flex-sub padding-sm solid text-bold text-xs">返工</view>
							<view class="flex-twice padding-sm solid text-bold text-xs">收货日期</view>
							<view class="flex-twice padding-sm solid text-bold text-xs">操作</view>
						</view>
						<view v-for="(detail,ix) in receive.get_detail" :key="ix" class="flex text-center bg-white">
							<view class="flex-sub padding-sm solid text-xs">{{detail.color_name}}</view>
							<view class="flex-sub padding-sm solid">{{parseFloat(detail.get_count).toFixed()}}</view>
							<view class="flex-sub padding-sm solid">{{parseFloat(detail.bad_count).toFixed()}}</view>
							<view class="flex-sub padding-sm solid">{{parseFloat(detail.back_count).toFixed()}}</view>
							<view class="flex-twice padding-sm solid text-xs">{{detail.create_time}}</view>
							<view class="flex-twice padding-sm solid">
								<button class="cu-btn sm line-red" @tap="deleteGetDetail(detail.id)">删除</button>
							</view>
						</view>
						<view class="flex text-center bg-white">
							<view class="flex-sub padding-sm solid text-xs">合计</view>
							<view class="flex-sub padding-sm solid">{{parseFloat(receive.sum_get_count).toFixed()}}</view>
							<view class="flex-sub padding-sm solid">{{parseFloat(receive.sum_bad_count).toFixed()}}</view>
							<view class="flex-sub padding-sm solid">{{parseFloat(receive.sum_back_count).toFixed()}}</view>
							<view class="flex-twice padding-sm solid">-</view>
							<view class="flex-twice padding-sm solid"> - </view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

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
				showTop: true,
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
				xgArray: ['', 'color', 'brand', 'size', 'process', 'season', 'unit', 'production', 'level', 'material_type',
					'depots', 'year', 'design_company', 'style_type', 'supplier', 'style_code', 'buyer', 'produce_company',
					'association'
				],
				startDate: getDate('start'),
				endDate: getDate('end'),
				imgList: [],
				picList: [],
				infoTab: 1,
				sendDetail: [],
				receiveDetail: [],
				getParams:{},
				getHistoryModal:''
			}
		},
		components: {
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			// 获取要修改的一条资源
			if (!e.id) {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			}
			this.itemID = e.id
			this.getEditOne()
			this.getPickerData()
			this.getAllSend()
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			getEditOne() {
				api.get({
					url: 'home/plans/' + this.itemID,
					success: res => {
						console.log(res.data)
						this.params = {
							plan_id: this.itemID,
							design_id: res.data.design_id,
							style_code: res.data.style_code,
							process: res.data.process,
							send_date: getDate(),
							plan_detail: []
						}
						//todo 获取一下本次发货 默认值
						var details = res.data.plan_detail
						for (var i=0, len=details.length; i<len; i++) {
							var can_send = parseFloat(details[i].true_count)-parseFloat(details[i].send_count)
							var obj = {
								color_id: details[i].color_id,
								color_name: details[i].color_name,
								true_count: details[i].true_count,
								can_send: can_send,
								send_count: can_send
							}
							this.params.plan_detail.push(obj)
						}

						this.imgList = res.data.design.design_img
						this.picList = res.data.plan_pic
					}
				});
			},
			//获取任务单发货明细
			getAllSend() {
				api.get({
					url: 'home/plans/' + this.itemID + '/send',
					success: res => {
						console.log(res.data)
						this.sendDetail = res.data
					}
				});
			},
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depot
				//11.year 12.design_company 13.style_type 14.supplier 15.style_code 16.buyer 17.produce_company 18.association
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '7,18'
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
			hideModal(e) {
				if(e == 1) {
					this.getAllSend()
					this.showTop = true
					this.getHistoryModal = ''
				} else {
					this.modalName = null
				}
			},
			//日期选择
			bindDateChange(e) {
				this.$set(this.params, e.target.id, e.target.value)
			},
			getDateChange(e) {
				this.$set(this.getParams, e.target.id, e.target.value)
			},
			//切换信息栏
			changeInfoTab(tag) {
				this.infoTab = tag
			},
			
			confirmFinish(id) {
				var options = {
					url: 'home/sends/' + id + '/finish',
					method: 'PUT',
					data: {},
					content: '您确定要结单吗？结单后将不能再修改！',
					msg: '结单完成！'
				}
				api.ggConfirm(options, this.getAllSend)
			},
			
			//准备收货
			goToGet(item,send) {
				this.getParams = {
					send_detail_id: item.id,
					plan_id: send.plan_id,
					send_id: send.id,
					design_id: send.design_id,
					style_code: send.style_code,
					association_id: send.association_id,
					color_id: item.color_id,
					color_name: item.color_name,
					get_count:parseFloat(item.send_count)-parseFloat(item.receive_count),
					default_count:parseFloat(item.send_count)-parseFloat(item.receive_count)
				}
				this.modalName = 'bottomModal'
			},
			//收货确认提交
			getSubmit() {
				console.log(this.getParams)
				if(this.getParams.get_count > this.getParams.default_count) {
					uni.showToast({
						icon: 'none',
						title: '实收数量不能大于发货数量'
					});
					return;
				}
				api.post({
					url: 'home/gets',
					data: this.getParams,
					success: res => {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						if (res.code == 1) {
							this.getAllSend()
							this.modalName = null
						}
					}
				});
			},

			//发货
			sendSubmit() {
				//先判断本次发货数量是否符合逻辑
				var details = this.params.plan_detail
				for (var i=0, len=details.length; i<len; i++) {
					if (parseFloat(details[i].send_count) <= 0) {
						uni.showToast({
							icon: 'none',
							title: '发货数量必须大于0'
						});
						return;
					}
					if (parseFloat(details[i].true_count) < parseFloat(details[i].send_count)) {
						uni.showToast({
							icon: 'none',
							title: '发货数量不能大于裁床数量'
						});
						return;
					}
					if (parseFloat(details[i].can_send) < parseFloat(details[i].send_count)) {
						uni.showToast({
							icon: 'none',
							title: '发货数量不能大于可发数量'
						});
						return;
					}
				}
				
				var params = this.params
				params.details = JSON.stringify(this.params.plan_detail)
				api.post({
					url: 'home/sends',
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
			},
			
			//获取收货历史数据
			getHistoryData() {
				api.get({
					url: 'home/plans/' + this.itemID + '/receive',
					success: res => {
						this.receiveDetail = res.data
					}
				});
			},
			//查看收货历史
			getHistory() {
				this.getHistoryData()
				this.getHistoryModal = 'show'
				this.showTop = false
			},
			//删除收货明细
			deleteGetDetail(id) {
				var deleteUrl = 'home/gets/' + id + '/detail'
				api.ggDelete(deleteUrl, this.getHistoryData)
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
