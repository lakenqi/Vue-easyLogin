// ================================================ // = easyUtil.loginUi for Vue component = // = v1.0 = // = (c) Copyright 2018 qiyan. All Rights Reserved. = //================================================
<template>
	<div id="easyUtil-login-part" class="easyUtil-login-body" @keyup.13="toSubmit()">
		<div class="easyUtil-login-title">{{title}}</div>
		<hr/>
		<div class="easyUtil-login-content">
			<span class="easyUtil-login-word" v-if="word">用户名:</span>
			<span v-if="icon" class="easyUtil-login-icon"><i :class="icons.user"></i></span>
			<input ref="user" type="text" v-model="values.user" @blur="checkVal('user')" @focus="inputState('user')" @keyup="forget()" :placeholder="placeholders.user" />
			<span v-show="deletes.user" @click="toDelete('user')" class="easyUtil-login-delete">×</span>
			<div v-show="errorFlag.user" class="easyUtil-login-errorCode">{{errorInfo.user}}</div>
		</div>
		<div class="easyUtil-login-content">
			<span class="easyUtil-login-word" v-if="word">密码:</span>
			<span v-if="icon" class="easyUtil-login-icon"><i :class="icons.pwd"></i></span>
			<input ref="pwd" type="password" v-model="values.pwd" @blur="checkVal('pwd')" @focus="inputState('pwd')" :placeholder="placeholders.pwd" />
			<span v-show="deletes.pwd" @click="toDelete('pwd')" class="easyUtil-login-delete">×</span>
			<div v-show="errorFlag.pwd" class="easyUtil-login-errorCode">{{errorInfo.pwd}}</div>
		</div>
		<div v-if="hasCode" class="easyUtil-login-content">
			<span v-if="word" class="easyUtil-login-word">验证码:</span>
			<span v-if="icon" class="easyUtil-login-icon"><i :class="icons.code"></i></span>
			<input ref="code" type="text" v-model="code" @keyup="check()" @blur="checkVal('code')" @focus="inputState('code')" :placeholder="placeholders.code" />
			<span v-show="deletes.code" @click="toDelete('code')" class="easyUtil-login-delete">×</span>
			<div v-show="errorFlag.code" class="easyUtil-login-errorCode">{{errorInfo.code}}</div>
			<img id="easyUtil-login-codeImg" :src="imgPath" class="easyUtil-login-codeImg" @click="getImg()" :title="imgTitle" />
		</div>
		<div class="easyUtil-login-remember">
			<label for="easyUtil-login-remember-input" class="easyUtil-login-label">
						<input id="easyUtil-login-remember-input" type="checkbox" v-model="checked" />
						<span>{{remember}}</span>
					</label>
		</div>
		<button type="button" :disabled="disabled" :class="{'easyUtil-login-btn':true,'easyUtil-login-btn-abled':!disabled}" @click="toSubmit()" class="">{{btnText}}</button>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "用户登录"
			},
			word: {
				type: Boolean,
				default: true
			},
			icon: {
				type: Boolean,
				default: false
			},
			imgTitle: {
				type: String,
				default: '换一张图片',
			},
			imgPath: {
				type: String,
				default: '',
			},
			placeholders: {
				type: Object,
				default() {
					return {
						user: '请输入用户名',
						pwd: '请输入密码',
						code: '请输入验证码'
					}
				}
			},
			icons: {
				type: Object,
				default() {
					return {
						user: 'iconFont icon-user',
						pwd: 'iconFont icon-pwd',
						code: 'iconFont icon-code'
					}
				}
			},
			btnText: {
				type: String,
				default: '登录',
			},
			hasCode: {
				type: Boolean,
				default: true,
			},
			codeFlag: {
				type: Boolean,
				default: false,
			},
			remember: {
				type: String,
				default: '记住用户名',
			},
			errorInfo: {
				type: Object,
				default: function() {
					return {
						user: "用户名不能为空",
						pwd: "密码不能为空",
						code: "验证码不能为空",
					}
				}
			}
		},
		created() {
			//获得缓存
			this.values.user = this.getCookie();
			//又缓存则显示记住
			(this.values.user) && (this.checked = true);
			//获得图片
			this.getImg();
		},
		mounted() {
			this.$nextTick(() => {
				//自动聚焦
				for(let key in this.values) {
					key = (key !== "isCode" ? key : "code");
					if(!this.values[key]) {
						this.$refs[key].focus();
						this.$refs[key].parentNode.className = this.BASIC_CLASS + ' ' + this.SELECTED_CLASS;
						break;
					}
				}
			})
		},
		data() {
			return {
				codeEmpty: this.errorInfo.code,
				values: {
					user: "",
					pwd: "",
					isCode: false,
				},
				deletes: {
					user: false,
					pwd: false,
					code: false,
				},
				errorFlag: {
					user: false,
					pwd: false,
					code: false,
				},
				code: "",
				disabled: true,
				checked: false,
				BASIC_CLASS: "easyUtil-login-content",
				SELECTED_CLASS: "easyUtil-login-selected",
				ERROR_CLASS: "easyUtil-login-error",
			}
		},
		watch: {
			values: {
				handler() {
					//全通过则可以提交
					if(this.hasCode && (this.values.user) && (this.values.pwd) && (this.values.isCode)) {
						this.disabled = false;
					} else if((this.values.user) && (this.values.pwd) && (!this.hasCode)) {
						this.disabled = false;
					} else {
						this.disabled = true;
					}
					//名称输入删除显示
					if(this.values.user) {
						this.deletes.user = true; //删除显示
						//this.checked = true; //自动激活缓存
					} else {
						this.deletes.user = false;
						//this.checked = false; //自动删除缓存
					};
					//密码删除显示
					if(this.values.pwd) {
						this.deletes.pwd = true;
					} else {
						this.deletes.pwd = false;
					};
				},
				/*immediate: true,*/ 
				deep: true
			},
			//验证码输入正确与否监控
			codeFlag() {
				this.__codeCheckStyle();
			},
			//验证码监控
			code: {
				handler() {
					if(this.code) {
						this.deletes.code = true;
						this.__codeCheckStyle();
					} else {
						this.values.isCode = false; //判断标识
						this.deletes.code = false; //删除标识
					}
				},
				immediate: true,
			},
			//记住名称监控
			checked: {
				handler() {
					this.handlerCookie(this.checked);
				},
				/*immediate: true,*/
			}
		},
		methods: {
			//非空验证
			checkVal(i) {
				let val = (i !== "code" ? this.values[i] : this.code);
				if(!val) {
					this.errorFlag[i] = true;
					this.errorInfo.code = this.codeEmpty;
					this.$refs[i].parentNode.className = this.BASIC_CLASS + ' ' + this.ERROR_CLASS;
				} else {
					this.$refs[i].parentNode.className = this.BASIC_CLASS;
				}
			},
			//用户名有输入动作时，自动清除缓存
			forget() {
				this.checked = false;
			},
			//获得焦点
			inputState(i) {
				((this.errorFlag[i]) && (this.errorFlag[i] = false));
				this.$refs[i].parentNode.className = this.BASIC_CLASS + ' ' + this.SELECTED_CLASS;
			},
			//点击删除
			toDelete(i) {
				i !== "code" ? this.values[i] = "" : this.code = "";
				this.$refs[i].focus();
				this.inputState(i);
				i === "user" && (this.checked = false);
			},
			//cookie缓存
			handlerCookie(flag) {
				if(flag) {
					//缓存
					Cookie.setCookie("loginName", this.values.user);
				} else {
					//删除
					Cookie.delCookie("loginName");
				}
			},
			//获得cookie
			getCookie() {
				return Cookie.getCookie("loginName");
			},
			//获得验证码图片
			getImg() {
				this.$emit('get-img');
			},
			//验证码验证
			check() {
				this.$emit('check-code', this.code); //激活父组件通信，需要改-，html不分大小写
			},
			//验证样式
			__codeCheckStyle() {
				if(this.codeFlag) {
					this.values.isCode = true;
					this.errorFlag.code = false;
					this.$refs.code.parentNode.className = this.BASIC_CLASS + ' ' + this.SELECTED_CLASS;
				} else {
					this.values.isCode = false;
					this.errorFlag.code = true;
					this.errorInfo.code = "验证码不正确";
					this.$refs.code.parentNode.className = this.BASIC_CLASS + ' ' + this.ERROR_CLASS;
				}
			},
			//数据提交
			toSubmit() {
				if(this.disabled) {
					return;
				}
				let val = {
					user: this.values.user,
					pwd: this.values.pwd
				};
				this.$emit('submit', val);
			},

		}
	}
</script>

<style>
	[v-cloak] {
		display: none;
	}
	
	input::-ms-clear {
		display: none;
	}
	
	input::-ms-reveal {
		display: none;
	}
	
	.easyUtil-login-body {
		text-align: center;
		border: 1px solid rgba(0, 0, 0, 0.5);
		border-radius: 5px;
		padding: 0.5em 1.5em;
		min-width: 20vw;
		box-sizing: border-box;
		margin: auto;
		width: 22em;
		position: absolute;
		left: 0;
		right: 0;
		font-size: 1em;
	}
	
	.easyUtil-login-body hr {
		border: 1px solid rgba(0, 0, 0, 0.3);
	}
	
	.easyUtil-login-title {
		text-align: center;
		font-weight: bolder;
		font-size: 1.5em;
		margin-bottom: 0.5em;
	}
	
	.easyUtil-login-content {
		border: 2px solid rgba(0, 0, 0, 0.4);
		margin: 1.4em 0 1.2em;
		border-radius: 5px;
		background-color: #fff;
		display: -webkit-flex;
		display: flex;
		justify-content: space-between;
		position: relative;
	}
	
	.easyUtil-login-content input {
		border: none;
		box-sizing: border-box;
		padding: 0 1vw 0 .5vw;
		align-items: stretch;
		flex-grow: 1;
		height: 40px;
	}
	
	.easyUtil-login-content:hover {
		border: 2px solid #54C9FF;
	}
	
	.easyUtil-login-content:nth-of-type(4) {
		width: 62%;
	}
	
	.easyUtil-login-content:nth-of-type(4) input {
		width: 75%;
	}
	
	.easyUtil-login-icon {
		color: rgba(0, 0, 0, 0.4);
		display: inline-block;
		width: 2.5em;
		font-size: 1em;
		text-align: center;
		line-height: 2.5;
		border-right: 1px solid;
	}
	
	.easyUtil-login-errorCode {
		color: #bc0000;
		position: absolute;
		top: 110%;
		right: 1em;
		font-size: 0.8em;
	}
	
	.easyUtil-login-error {
		border: 2px solid #bc0000;
	}
	
	.easyUtil-login-selected {
		border: 2px solid #54C9FF;
	}
	
	.easyUtil-login-selected .easyUtil-login-icon {
		color: #FFFFFF;
		background-color: #54C9FF;
	}
	
	.easyUtil-login-delete {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: grey;
		opacity: .3;
		cursor: pointer;
		line-height: 1.2;
		text-align: center;
		margin: 0.6em auto;
		color: rgba(0, 0, 0, 0.4);
		font-weight: bolder;
		position: absolute;
		right: 5px;
	}
	
	.easyUtil-login-delete:hover {
		opacity: .8;
		color: #FFFFFF;
	}
	
	.easyUtil-login-codeImg {
		width: 6.5em;
		position: absolute;
		height: 100%;
		right: -7.5em;
		border: 1px solid;
		cursor: pointer;
	}
	
	.easyUtil-login-remember {
		text-align: left;
		font-size: 0.8em;
		margin-top: -0.5em;
	}
	
	.easyUtil-login-remember label,
	.easyUtil-login-remember input {
		cursor: pointer;
	}
	
	.easyUtil-login-btn {
		background-color: gainsboro !important;
		border-radius: 5px;
		cursor: pointer;
		height: 6vh;
		line-height: 6vh;
		width: 100%;
		margin: 1em auto;
	}
	
	.easyUtil-login-btn-abled {
		background-color: rgba(255, 187, 0, 0.8) !important;
	}
	
	.easyUtil-login-btn-abled:hover {
		background-color: #ffbb00 !important;
	}
	
	.easyUtil-login-word {
		position: absolute;
		top: -22px;
		left: 3px;
		font-size: 0.8em;
	}
	/*# sourceMappingURL=easyUtil.loginUi.Vue.css.map */
</style>