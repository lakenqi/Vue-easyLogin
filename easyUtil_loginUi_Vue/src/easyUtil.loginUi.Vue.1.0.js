/* ================================================
 *  = easyUtil.loginUi for Vue component  =
 *  = v1.0 =
 *  = (c) Copyright 2018 qiyan. All Rights Reserved.  =
 ================================================ */
;
"use strict";
Vue.component('easyLogin', {
	template: `<div id="easyUtil-login-part" class="easyUtil-login-body" @keyup.13="toSubmit()">
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
					<img id="easyUtil-login-codeImg" :src="imgPath" class="easyUtil-login-codeImg" @click="getImg()" :title="imgTitle"/>
				</div>
				<div class="easyUtil-login-remember">
					<label for="easyUtil-login-remember-input" class="easyUtil-login-label">
						<input id="easyUtil-login-remember-input" type="checkbox" v-model="checked" />
						<span>{{remember}}</span>
					</label>
				</div>
				<button type="button" :disabled="disabled" :class="{'easyUtil-login-btn':true,'easyUtil-login-btn-abled':!disabled}" @click="toSubmit()" class="">{{btnText}}</button>
			</div>`,
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
			//获得图片
			this.getImg();
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
				if(this.hasCode && (this.values.user) && (this.values.pwd) && (this.values.isCode)){
					this.disabled = false;
				}else if((this.values.user) && (this.values.pwd) && (!this.hasCode)) {
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
			/*immediate: true,*/ //
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
		__codeCheckStyle(){
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
});
//cookie函数
(function() {
	var Cookie = {
		setCookie(key, value, expire_days = 7) {
			var date = new Date();
			date.setDate(date.getDate() + expire_days);
			document.cookie = key + "=" + encodeURIComponent(value) + ";expires=" + date.toGMTString() + ";path=/";
		},
		getCookie(key) {
			let reg = RegExp('(?:^| )' + key + '=([^;]+)(?:;|$)'), //直接开头或有空格，中间不含分号，分号结束或是结尾
				arr = document.cookie.match(reg);
			if(arr) {
				return decodeURIComponent(arr[1]);
			}
			return null;
		},
		delCookie(key) {
			var date = new Date();
			date.setDate(date.getDate() - 1);
			document.cookie = key + "=" + encodeURIComponent(this.getCookie(key)) + ";expires=" + date.toGMTString() + ";path=/";
		}
	}
	window.Cookie = Cookie;
})();