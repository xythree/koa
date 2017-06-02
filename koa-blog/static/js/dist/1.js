webpackJsonp([1],{

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(47)

/* script */
__vue_exports__ = __webpack_require__(48)

/* template */
var __vue_template__ = __webpack_require__(46)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "D:\\git\\koa\\koa-blog\\vue_component\\home\\waveButton.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-00a91377"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-00a91377", __vue_options__)
  } else {
    hotAPI.reload("data-v-00a91377", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] waveButton.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.__wave-button-ripple[data-v-00a91377] {\n  background: transparent;\n  border: none;\n  border-radius: 3px;\n  position: relative;\n  height: 100%;\n  width: 100%;\n  text-align: center;\n  display: inline-block;\n  cursor: pointer;\n  outline: none;\n  overflow: hidden;\n  -webkit-tap-highlight-color: transparent;\n}\n.__wave-button-ripple[data-v-00a91377]:hover {\n    background-color: rgba(158, 158, 158, 0.15);\n}\n.__wave-button-ripple .__wave-ripple[data-v-00a91377] {\n    position: absolute;\n    background: rgba(166, 166, 166, 0.5);\n    border-radius: 100%;\n    -webkit-transform: scale(0);\n        -ms-transform: scale(0);\n            transform: scale(0);\n}\n.__wave-button-ripple .animate[data-v-00a91377] {\n    -webkit-animation: ripple 0.55s linear;\n            animation: ripple 0.55s linear;\n}\n@-webkit-keyframes ripple {\n100% {\n    opacity: 0;\n    -webkit-transform: scale(2.5);\n            transform: scale(2.5);\n}\n}\n@keyframes ripple {\n100% {\n    opacity: 0;\n    -webkit-transform: scale(2.5);\n            transform: scale(2.5);\n}\n}\n", ""]);

// exports


/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "button",
    staticClass: "__wave-button-ripple",
    on: {
      "click": _vm.reppleClick
    }
  }, [_vm._t("default"), _vm._v(" "), _c('span', {
    ref: "repple",
    staticClass: "__wave-ripple",
    class: {
      'animate': _vm.animate
    }
  })], 2)
},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-00a91377", module.exports)
  }
}

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(0)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/_css-loader@0.25.0@css-loader/index.js!../../node_modules/_vue-loader@9.9.5@vue-loader/lib/style-rewriter.js?id=data-v-00a91377&scoped=true!../../node_modules/_sass-loader@4.0.2@sass-loader/index.js!../../node_modules/_vue-loader@9.9.5@vue-loader/lib/selector.js?type=styles&index=0!./waveButton.vue", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.25.0@css-loader/index.js!../../node_modules/_vue-loader@9.9.5@vue-loader/lib/style-rewriter.js?id=data-v-00a91377&scoped=true!../../node_modules/_sass-loader@4.0.2@sass-loader/index.js!../../node_modules/_vue-loader@9.9.5@vue-loader/lib/selector.js?type=styles&index=0!./waveButton.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ["waveCallBack"],
    data() {
        return {
            animate: false
        };
    },
    mounted() {
        let button = this.$refs.button;
        let repple = this.$refs.repple;
        let v = Math.max(button.offsetHeight, button.offsetWidth);

        repple.style.width = repple.style.height = v + "px";
        button.style.lineHeight = button.offsetHeight + "px";
    },
    methods: {
        reppleClick(e) {
            let ripple = this.$refs.repple;
            let x = e.offsetX - ripple.offsetWidth / 2;
            let y = e.offsetY - ripple.offsetHeight / 2;

            ripple.style.left = x + "px";
            ripple.style.top = y + "px";
            this.animate = true;

            this.$nextTick(() => {
                setTimeout(() => {
                    this.animate = false;
                }, 660);
            });

            this.waveCallBack && this.waveCallBack();
        }
    }
});

/***/ })

});