!function e(t,a,s){function o(i,r){if(!a[i]){if(!t[i]){var l="function"==typeof require&&require;if(!r&&l)return l(i,!0);if(n)return n(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var m=a[i]={exports:{}};t[i][0].call(m.exports,function(e){var a=t[i][1][e];return o(a?a:e)},m,m.exports,e,t,a,s)}return a[i].exports}for(var n="function"==typeof require&&require,i=0;i<s.length;i++)o(s[i]);return o}({"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/app-actions.js":[function(e,t,a){"use strict";var s=e("reflux");t.exports=s.createActions({showNotification:{},clearNotification:{},clearNotificationAfter:{},openModal:{}})},{reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/token-actions.js":[function(e,t,a){"use strict";var s=e("reflux");t.exports=s.createActions({refreshTokenList:{asyncResult:!0},deleteToken:{asyncResult:!0},createToken:{asyncResult:!0},editToken:{asyncResult:!0}})},{reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/user-actions.js":[function(e,t,a){"use strict";var s=e("reflux");t.exports=s.createActions({userLogin:{asyncResult:!0},userLogout:{asyncResult:!0}})},{reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/components/modals/base-modal.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=s.addons.CSSTransitionGroup,n=e("reflux"),i=e("react-keybinding"),r=e("../../actions/app-actions"),l=s.createClass({displayName:"BModal",mixins:[n.listenTo(r.openModal,"onOpenModal"),i],keybindings:{esc:function(){this.props.onCloseClick!==!1&&this.props.onCloseClick.call(this)}},onOpenModal:function(e){e==this.props.type&&this.setState({revealed:!0})},getInitialState:function(){return{revealed:this.props.revealed}},getDefaultProps:function(){return{header:null,body:null,footer:null,revealed:!1,animation:!0,onOverlayClick:function(e){e.target===e.currentTarget&&this.setState({revealed:!1})},onCloseClick:function(e){this.setState({revealed:!1})}}},onOverlayClick:function(e){this.props.onOverlayClick!==!1&&this.props.onOverlayClick.call(this,e)},onCloseClick:function(e){e.preventDefault(),this.props.onCloseClick!==!1&&this.props.onCloseClick.call(this,e)},render:function(){var e=null,t=null,a=null;return this.props.header!==!1&&(t=s.createElement("header",{className:"modal-header"},this.props.header)),this.props.footer!==!1&&(a=s.createElement("footer",{className:"modal-footer"},this.props.footer)),this.state.revealed&&(e=s.createElement("section",{className:"modal",key:"modal-"+this.props.type,onClick:this.onOverlayClick,id:"modal-"+this.props.type},s.createElement("div",{className:"modal-inner"},s.createElement("span",{className:"dismiss-modal"},s.createElement("a",{className:"close",title:"Close",onClick:this.onCloseClick},s.createElement("span",null,"Close"))),t,s.createElement("div",{className:"modal-body"},this.props.body),a))),this.props.animation?s.createElement(o,{component:"div",transitionName:"modal"},e):e}});t.exports=l},{"../../actions/app-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/app-actions.js","react-keybinding":"react-keybinding","react/addons":"react/addons",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/components/modals/token-form-modal.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=e("reflux"),n=e("./base-modal"),i=e("../../actions/token-actions"),r=e("../../actions/app-actions"),l=e("react-widgets").DateTimePicker,c=e("react-validation-mixin"),m=e("joi"),d=s.createClass({displayName:"TokenFormModal",mixins:[c,o.listenTo(i.editToken.completed,"onTokenEditSuccess"),o.listenTo(i.editToken.failed,"onTokenEditFail"),o.listenTo(i.createToken.completed,"onTokenCreateSuccess"),o.listenTo(i.createToken.failed,"onTokenCreateFail")],validatorTypes:{token:m.object().keys({name:m.string().required(),expiration:m.alternatives()["try"](m.date().min("now"),m["boolean"]()).invalid(!0).required(),status:m.any().valid("active","blocked").required()})},getInitialState:function(){return{token:{name:this.props.data.name,expiration:this.props.data.expiration,status:this.props.data.status}}},getHeader:function(){return s.createElement("h1",{className:"modal-title"},"create"===this.props.action?"Create token":"Edit token")},getBody:function(){return s.createElement("div",null,s.createElement("form",{className:"form-horizontal form-edit"},"create"===this.props.action?null:s.createElement("div",{className:"form-group"},s.createElement("label",{className:"form-label"},"Key"),s.createElement("div",{className:"form-control-set"},s.createElement("input",{type:"text",className:"form-control",name:"token",value:this.props.data.token,readOnly:!0}))),s.createElement("div",{className:"form-group"},s.createElement("label",{className:"form-label none"},"Description"),s.createElement("div",{className:"form-control-set"},s.createElement("input",{type:"text",className:"form-control",placeholder:"Short description",name:"name",value:this.state.token.name,onChange:this.onValueChange,onBlur:this.handleValidation("token.name"),maxLength:"128"}),this.renderErrorMessage(this.getValidationMessages("token.name")[0]))),s.createElement("div",{className:"form-group"},s.createElement("label",{className:"form-label none"},"Expiration"),s.createElement("div",{className:"form-control-set"},s.createElement(l,{ref:"expiration",format:"yyyy-MM-dd HH:mm:ss",timeFormat:"HH:mm",placeholder:"(optional)",value:this.getValueForDate("expiration"),onChange:this.onDateChange.bind(null,"expiration")}),this.renderErrorMessage(this.getValidationMessages("token.expiration")[0]))),s.createElement("div",{className:"form-group"},s.createElement("label",{className:"form-label"},"Status"),s.createElement("div",{className:"form-options-set"},s.createElement("div",{className:"radio"},s.createElement("label",null,s.createElement("input",{type:"radio",name:"status",value:"active",checked:"active"===this.state.token.status,onChange:this.onValueChange})," Active")),s.createElement("div",{className:"radio"},s.createElement("label",null,s.createElement("input",{type:"radio",name:"status",value:"blocked",checked:"blocked"===this.state.token.status,onChange:this.onValueChange})," Blocked")))),s.createElement("div",{className:"form-actions"},s.createElement("button",{type:"button",className:"bttn-cancel",onClick:this.props.onCloseClick},s.createElement("span",null,"Cancel")),s.createElement("button",{type:"submit",className:"bttn-save",onClick:this.onSubmit},s.createElement("span",null,"Save")))),this.state.loading?s.createElement("p",{className:"loading revealed"},"Loading"):null)},getFooter:function(){return!1},render:function(){return s.createElement(n,{type:"token-editing",onOverlayClick:!1,onCloseClick:this.props.onCloseClick,revealed:this.props.revealed,header:this.getHeader(),body:this.getBody(),footer:this.getFooter(),animation:!1})},renderErrorMessage:function(e){return e=e||"",0===e.trim().length?null:s.createElement("p",{className:"message message-alert"},e)},getValueForDate:function(e){return null===this.state.token[e]||this.state.token[e]===!1?null:new Date(this.state.token[e])},onValueChange:function(e){var t=this.state.token;t[e.target.name]=e.target.value,this.setState(t)},onDateChange:function(e,t,a){var s=null!==t&&t.toISOString(),o=this.state.token;o[e]=s,this.setState(o)},onSubmit:function(e){e.preventDefault(),this.state.errors={},this.validate(function(e,t){if(e)console.log(t);else{if(this.state.loading)return;this.setState({loading:!0}),this.props.data._id?(console.log("TokenFormModal editing"),i.editToken(this.props.data._id,this.state.token)):(console.log("TokenFormModal creating"),i.createToken(this.state.token))}}.bind(this))},onTokenEditSuccess:function(){r.showNotification("success","Token successfully updated!"),r.clearNotificationAfter(4e3),this.setState({loading:!1}),this.props.onCloseClick()},onTokenEditFail:function(e){r.showNotification("alert",e),this.setState({loading:!1})},onTokenCreateSuccess:function(){r.showNotification("success","Token successfully created!"),r.clearNotificationAfter(4e3),this.setState({loading:!1}),this.props.onCloseClick()},onTokenCreateFail:function(e){r.showNotification("alert",e),this.setState({loading:!1})}});t.exports=d},{"../../actions/app-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/app-actions.js","../../actions/token-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/token-actions.js","./base-modal":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/components/modals/base-modal.js",joi:"joi","react-validation-mixin":"react-validation-mixin","react-widgets":"react-widgets","react/addons":"react/addons",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/components/notifications.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=s.createClass({displayName:"Notifications",dismissNotification:function(e){e.preventDefault(),this.props.onNotificationDismiss()},render:function(){if(null===this.props.type)return null;var e="notification notification-"+this.props.type;return s.createElement("div",{className:e,role:"alert"},s.createElement("p",null,this.props.children),s.createElement("a",{href:"#",className:"notification-dismiss",title:"Dismiss notification",onClick:this.dismissNotification},s.createElement("span",null,"Dismiss")))}});t.exports=o},{"react/addons":"react/addons"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config.js":[function(e,t,a){var s={local:e("./config/local.js"),logo:e("./config/logo.js"),production:e("./config/production.js"),staging:e("./config/staging.js")},o=s.production,n=s.local||{};for(var i in o)t.exports[i]=o[i];for(var i in n)t.exports[i]=n[i]},{"./config/local.js":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/local.js","./config/logo.js":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/logo.js","./config/production.js":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/production.js","./config/staging.js":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/staging.js"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/local.js":[function(e,t,a){t.exports={}},{}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/logo.js":[function(e,t,a){var s=["╭──────────────────────────────────────╮","│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░█░░░░░░░░░░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░░█░░█░░░░█░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░░██░░█░░██░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░░███░█░███░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░░███░████░░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░░███████░░░░░░█░░░█░░░░░│","│░░░░░░░░██░░░░░██████░░░░░██░░██░░░░░░│","│░░░░░█░░░██░░░░░█████░░░███░███░░░░░░░│","│░░░░░░██░░███░░░█████░░██████░░░░░░░░░│","│░░░░░░░░██░███░░█████░░████░░░░░░░░░░░│","│░░░░░░░░░██████░░████░███░░░░░░░░░░░░░│","│░░░░░░░░░░░░████░███░░█░░░░░░░░░░░░░░░│","│░░░░░░█████░░░░████░░░░░░░░░░░░░░░░░░░│","│░░░░░░░░██████░░░██░░░█░░░░░░░░░░░░░░░│","│░░░░░░░░░░░░████░█████░░░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░██████░░░░░░░░░░░░░░░░░░│","│░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░│","╰──────────────────────────────────────╯"],o=[];s=s.map(function(e,t){return e.replace(/(^|[|│])|(░+)|(█+)/g,function(e,t,a,s){return t?(o.push("black"),"%c"+t):a?(o.push("#cf3f02"),"%c"+a):s||!e?(o.push("black"),"%c"+(s||"")):void 0})}).concat(["                                        ","%c           DEVELOPMENT SEED             "]).join("\n"),o=o.map(function(e){return"color: "+e}).concat(["color: #cf3f02; font-weight: bold"]),t.exports=[s].concat(o)},{}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/production.js":[function(e,t,a){var s=e("./logo");t.exports={environment:"production",consoleMessage:s,OAMUploaderApi:"https://upload-api.openaerialmap.org"}},{"./logo":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/logo.js"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/staging.js":[function(e,t,a){t.exports={environment:"staging",OAMUploaderApi:"http://52.11.15.48"};var s=e("./production");for(var o in s)"undefined"==typeof t.exports[o]&&(t.exports[o]=s[o])},{"./production":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config/production.js"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/main.js":[function(e,t,a){"use strict";var s=e("./config");console.log.apply(console,s.consoleMessage);var o=e("react/addons"),n=e("react-router"),i=n.Route,r=(n.DefaultRoute,n.Redirect),l=e("./views/app"),c=e("./views/home"),m=e("./views/login"),d=e("./views/uhoh"),u=o.createElement(i,{handler:l},o.createElement(i,{name:"home",path:"/",handler:c}),o.createElement(i,{name:"login",path:"/login",handler:m}),o.createElement(i,{name:"404",path:"/404",handler:d}),o.createElement(r,{from:"*",to:"/404"}));n.run(u,function(e){o.render(o.createElement(e,null),document.querySelector(".site-canvas"))})},{"./config":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config.js","./views/app":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/app.js","./views/home":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/home.js","./views/login":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/login.js","./views/uhoh":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/uhoh.js","react-router":"react-router","react/addons":"react/addons"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/stores/token-store.js":[function(e,t,a){"use strict";var s=e("reflux"),o=e("../actions/token-actions"),n=e("../config"),i=e("jquery");t.exports=s.createStore({storage:{tokens:[]},init:function(){this.listenTo(o.refreshTokenList,this.refreshTokenList),this.listenTo(o.deleteToken,this.deleteToken),this.listenTo(o.createToken,this.createToken),this.listenTo(o.editToken,this.editToken)},refreshTokenList:function(){var e=this;i.ajax({type:"GET",url:n.OAMUploaderApi+"/tokens",xhrFields:{withCredentials:!0}}).done(function(t){e.storage.tokens=t.data,e.trigger()}).fail(function(e){var t=e.responseJSON;o.refreshTokenList.failed(t.message)})},deleteToken:function(e){var t=this;i.ajax({type:"DELETE",url:n.OAMUploaderApi+"/tokens/"+e,xhrFields:{withCredentials:!0}}).done(function(a){for(var s=t.storage.tokens.length,n=0;n<s&&t.storage.tokens[n]._id!==e;n++);t.storage.tokens.splice(n,1),t.trigger(),o.deleteToken.completed()}).fail(function(e){var t=e.responseJSON;o.deleteToken.failed(t.message)})},createToken:function(e){var t=this;i.ajax({type:"POST",url:n.OAMUploaderApi+"/tokens",data:e,xhrFields:{withCredentials:!0}}).done(function(e){t.storage.tokens.push(e.data),t.trigger(),o.createToken.completed()}).fail(function(e){var t=e.responseJSON;o.createToken.failed(t.message)})},editToken:function(e,t){var a=this;i.ajax({type:"PUT",url:n.OAMUploaderApi+"/tokens/"+e,data:t,xhrFields:{withCredentials:!0}}).done(function(t){for(var s=a.storage.tokens.length,n=0;n<s&&a.storage.tokens[n]._id!==e;n++);a.storage.tokens.splice(n,1,t.data),a.trigger(),o.editToken.completed()}).fail(function(e){var t=e.responseJSON;o.editToken.failed(t.message)})},getTokens:function(){return this.storage.tokens}})},{"../actions/token-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/token-actions.js","../config":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config.js",jquery:"jquery",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/stores/user-store.js":[function(e,t,a){"use strict";var s=e("reflux"),o=e("../actions/user-actions"),n=e("../config"),i=e("jquery");t.exports=s.createStore({storage:{user:{username:null,isLogged:!1}},init:function(){this.listenTo(o.userLogin,this.loginUser),this.listenTo(o.userLogout,this.logoutUser),this.checkLogin()},checkLogin:function(){var e=this;i.ajax({type:"GET",url:n.OAMUploaderApi+"/login",xhrFields:{withCredentials:!0}}).done(function(t){e.storage.user.username=t.data.username,e.storage.user.isLogged=!0,e.trigger()})},loginUser:function(e,t){var a=this;i.ajax({type:"POST",url:n.OAMUploaderApi+"/login",xhrFields:{withCredentials:!0},data:{username:e,password:t}}).done(function(t){a.storage.user.username=e,a.storage.user.isLogged=!0,o.userLogin.completed()}).fail(function(e){var t=e.responseJSON;o.userLogin.failed(t.message)})},logoutUser:function(){var e=this;i.ajax({type:"GET",url:n.OAMUploaderApi+"/logout",xhrFields:{withCredentials:!0}}).done(function(t){e.storage.user.username=null,e.storage.user.isLogged=!1,o.userLogout.completed()}).fail(function(){o.userLogout.failed()})},isLogged:function(){return this.storage.user.isLogged},getUsername:function(){return this.storage.user.username}})},{"../actions/user-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/user-actions.js","../config":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/config.js",jquery:"jquery",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/app.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=e("reflux"),n=e("react-router"),i=n.RouteHandler,r=e("../actions/app-actions"),l=e("../components/notifications"),c=e("../stores/user-store"),m=e("../actions/user-actions"),d=s.createClass({displayName:"App",mixins:[o.listenTo(r.showNotification,"onNotificationShow"),o.listenTo(r.clearNotification,"dismissNotification"),o.listenTo(r.clearNotificationAfter,"dismissNotification"),o.listenTo(m.userLogout.completed,"onLogoutSuccess"),n.Navigation,n.State],getInitialState:function(){return{notification:{type:null,message:null}}},onNotificationShow:function(e,t){this.setState({notification:{type:e,message:t}})},dismissNotification:function(e){e||(e=0),setTimeout(function(){this.setState({notification:{type:null,message:null}})}.bind(this),e)},logout:function(e){e.preventDefault(),m.userLogout()},onLogoutSuccess:function(){this.transitionTo("login"),r.showNotification("success","Sad to see you go!"),setTimeout(function(){r.clearNotification()},4e3)},renderUserInfo:function(){return c.isLogged()?s.createElement("nav",{className:"site-prime-nav"},s.createElement("h2",null,s.createElement("small",null,"Signed in as")," ",c.getUsername()),s.createElement("ul",{className:"meta-menu"},s.createElement("li",null,s.createElement("a",{href:"#",className:"bttn-signout",title:"Sign out",onClick:this.logout},s.createElement("span",null,"Sign out"))))):null},render:function(){return s.createElement("div",null,s.createElement("div",{className:"inner-wrapper"},s.createElement("header",{className:"site-header",role:"banner"},s.createElement("div",{className:"inner"},s.createElement("div",{className:"site-headline"},s.createElement("h1",{className:"site-title"},s.createElement("img",{src:"assets/graphics/layout/oam-logo-h-pos.svg",width:"167",height:"32",alt:"OpenAerialMap logo"}),s.createElement("span",null,"OpenAerialMap")," ",s.createElement("small",null,"Token Manager"))),this.renderUserInfo())),s.createElement("main",{className:"site-body",role:"main"},s.createElement("div",{className:"inner"},s.createElement(i,null)))),s.createElement(l,{type:this.state.notification.type,onNotificationDismiss:this.dismissNotification},this.state.notification.message))}});t.exports=d},{"../actions/app-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/app-actions.js","../actions/user-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/user-actions.js","../components/notifications":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/components/notifications.js","../stores/user-store":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/stores/user-store.js","react-router":"react-router","react/addons":"react/addons",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/home.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=e("reflux"),n=e("react-router"),i=e("../stores/user-store"),r=e("../stores/token-store"),l=(e("../actions/app-actions"),e("../actions/token-actions")),c=e("../components/modals/token-form-modal"),m=s.addons.CSSTransitionGroup,d=s.createClass({displayName:"Home",mixins:[o.listenTo(r,"onTokenStore"),o.listenTo(l.deleteToken.completed,"onTokenDeleteSuccess"),o.listenTo(l.deleteToken.failed,"onTokenDeleteFail"),n.Navigation],getInitialState:function(){return{tokens:[],formModal:{action:null,data:null}}},componentDidMount:function(){i.isLogged()?l.refreshTokenList():this.transitionTo("login")},onTokenStore:function(){this.setState({tokens:r.getTokens()})},onTokenDeleteSuccess:function(){},onTokenDeleteFail:function(){},deleteToken:function(e,t){t.preventDefault(),confirm("Are you sure you want to delete the token?")&&l.deleteToken(e)},openCreateModal:function(){this.setState({formModal:{action:"create",data:null}})},openEditModal:function(e){this.setState({formModal:{action:"edit",data:e}})},formModalDismiss:function(){this.setState({formModal:{action:null,data:null}})},renderTokens:function(){return 0===this.state.tokens.length?s.createElement("div",{className:"panel-blank-message"},s.createElement("p",null,"There are currently no tokens to manage. Start by adding one using the ",s.createElement("em",null,"Create")," button located above.")):s.createElement("div",{className:"panel-tabular-data"},s.createElement("table",{className:"table tokens-table"},s.createElement("thead",{className:"tokens-table-header"},s.createElement("tr",null,s.createElement("th",{className:"th-status"},s.createElement("a",{href:"#",title:"Sort by status",className:"sort sort-none"},"Status")),s.createElement("th",{className:"th-description"},"Key"),s.createElement("th",{className:"th-edit-date"},s.createElement("a",{href:"#",title:"Sort by edit date",className:"sort sort-desc"},"Last update")),s.createElement("th",{className:"th-expiration-date"},s.createElement("a",{href:"#",title:"Sort by expiration date",className:"sort sort-none"},"Expiration")),s.createElement("th",{className:"th-actions"},s.createElement("span",null,"Actions")))),s.createElement("tbody",null,this.state.tokens.map(this.renderTokenRow))))},renderTokenRow:function(e,t){var a="status status-"+e.status;return s.createElement("tr",{key:t},s.createElement("td",{className:"cell-status"},s.createElement("em",{className:a},e.status)),s.createElement("td",{className:"cell-description"},s.createElement("strong",null,e.token),s.createElement("p",null,e.name)),s.createElement("td",{className:"cell-edit-date"},this.formatDate(e.updated||e.created)),s.createElement("td",{className:"cell-expiration-date"},this.formatDate(e.expiration)),s.createElement("td",{className:"cell-actions"},s.createElement("ul",{className:"table-actions-list",role:"toolbar"},s.createElement("li",null,s.createElement("button",{type:"button",title:"Delete token",className:"bttn-delete",onClick:this.deleteToken.bind(null,e._id)},s.createElement("span",null,"Delete"))),s.createElement("li",null,s.createElement("button",{type:"button",title:"Edit token",className:"bttn-edit",onClick:this.openEditModal.bind(null,e)},s.createElement("span",null,"Edit"))))))},renderFormModal:function(){var e=null;if(null!==this.state.formModal.action){var t="edit"===this.state.formModal.action?this.state.formModal.data:{token:"",name:"",expiration:!1,status:"active"};e=s.createElement(c,{onCloseClick:this.formModalDismiss,revealed:!0,action:this.state.formModal.action,data:t})}return s.createElement(m,{component:"div",transitionName:"modal",transitionAppear:!0},e)},render:function(){return i.isLogged()?s.createElement("section",{className:"panel manager-panel"},s.createElement("header",{className:"panel-header"},s.createElement("div",{className:"panel-headline"},s.createElement("h1",{className:"panel-title"},"Tokens"),s.createElement("p",{className:"panel-subtitle"},this.state.tokens.length," entries")),s.createElement("div",{className:"panel-tools"},s.createElement("ul",{className:"panel-tools-list",role:"toolbar"},s.createElement("li",null,s.createElement("button",{type:"button",className:"bttn-add",title:"Create token",onClick:this.openCreateModal},s.createElement("span",null,"Create")))))),s.createElement("div",{className:"panel-body"},this.renderTokens()),s.createElement("footer",{className:"panel-footer"}),this.renderFormModal()):null},formatDate:function(e){if(null===e||e===!1)return"--";var t=new Date(e),a=t.getFullYear()+"-"+this.lt10pad(t.getMonth()+1)+"-"+this.lt10pad(t.getDate()),s=this.lt10pad(t.getHours())+":"+this.lt10pad(t.getMinutes())+":"+this.lt10pad(t.getSeconds());return a+" "+s},lt10pad:function(e){return e<10?"0"+e:e}});t.exports=d},{"../actions/app-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/app-actions.js","../actions/token-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/token-actions.js","../components/modals/token-form-modal":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/components/modals/token-form-modal.js","../stores/token-store":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/stores/token-store.js","../stores/user-store":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/stores/user-store.js","react-router":"react-router","react/addons":"react/addons",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/login.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=e("reflux"),n=e("react-router"),i=e("../actions/user-actions"),r=e("../actions/app-actions"),l=e("../stores/user-store"),c=s.createClass({displayName:"Login",mixins:[o.listenTo(i.userLogin.completed,"onLoginSuccess"),o.listenTo(i.userLogin.failed,"onLoginFail"),n.Navigation,n.State],componentDidMount:function(){return l.isLogged()?this.transitionTo("home"):void(document.body.className=document.body.className.replace(/ ?page-signin/,"")+" page-signin")},componentWillUnmount:function(){document.body.className=document.body.className.replace(/ ?page-signin/,"")},login:function(e){e.preventDefault();var t=s.findDOMNode(this.refs["signin-username"]),a=s.findDOMNode(this.refs["signin-password"]);i.userLogin(t.value,a.value)},onLoginSuccess:function(){r.showNotification("success","Welcome back!"),r.clearNotification(4e3),this.transitionTo("home")},onLoginFail:function(e){r.showNotification("alert",e);var t=s.findDOMNode(this);t.className=t.className.replace(/ ?form-says-no/,""),setTimeout(function(){t.className+=" form-says-no"},10)},render:function(){return s.createElement("section",{className:"panel signin-panel"},s.createElement("header",{className:"panel-header"},s.createElement("div",{className:"panel-headline"},s.createElement("h1",{className:"panel-title"},"Sign in"))),s.createElement("div",{className:"panel-body"},s.createElement("form",null,s.createElement("div",{className:"form-group"},s.createElement("label",{className:"form-label",htmlFor:"signin-username"},"Username"),s.createElement("div",{className:"form-control-set"},s.createElement("input",{type:"text",className:"form-control",placeholder:"Username",name:"signin-username",ref:"signin-username",id:"signin-username"}))),s.createElement("div",{className:"form-group"},s.createElement("label",{className:"form-label",htmlFor:"signin-password"},"Password"),s.createElement("div",{className:"form-control-set"},s.createElement("input",{type:"password",className:"form-control",placeholder:"Password",name:"signin-password",ref:"signin-password",id:"signin-password"}))),s.createElement("div",{className:"form-actions"},s.createElement("button",{type:"submit",className:"bttn-submit",onClick:this.login},s.createElement("span",null,"Sign in"))))))}});t.exports=c},{"../actions/app-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/app-actions.js","../actions/user-actions":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/actions/user-actions.js","../stores/user-store":"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/stores/user-store.js","react-router":"react-router","react/addons":"react/addons",reflux:"reflux"}],"/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/views/uhoh.js":[function(e,t,a){"use strict";var s=e("react/addons"),o=s.createClass({displayName:"UhOh",render:function(){return s.createElement("div",null,"404 - UhOh that is a bummer.")}});t.exports=o},{"react/addons":"react/addons"}]},{},["/home/travis/build/hotosm/oam-uploader-admin/app/assets/scripts/main.js"]);