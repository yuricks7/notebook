/**
 * 追尾する目次（ver3.3.0）
 *
 * 【参考】
 * はてなブログ向けのサイドバーで追尾する目次【ver3】 http://twilyze.hatenablog.jp/entry/sidebar-toc-3
 * https://gist.github.com/twilyze/30809fa76691983312dced621eb1040a
 */
(function() {
  'use strict';

  // -------------- ↓設定ここから↓ --------------
  const PAGES = [
    {
      class   : 'page-entry',
      title   : '目次',
      display : true
    },
    {
      class   : 'page-index',
      title   : 'このページの記事一覧',
      listPage: true,
      display : true
    },
    {
      class   : 'page-archive',
      title   : 'このページの記事一覧',
      listPage: true,
      display : true
    },
    {
      class   : 'page-static_page',
      title   : 'entry-title',
      display : false
    },
  ];

  const MATCH_MEDIA         = false;
  const MEDIA_QUERY_SIDEBAR = '(min-width: 768px)';
  const MARGIN_TOP     = 10;
  const MARGIN_BOTTOM  =  0;
  const CURRENT_MARGIN = 50;
  const ADJUST_FIXED   =  0;
  const MAX_HEIGHT     =  0;
  const HEADLINE_QUERY = ['h3', 'h4', 'h5'];
  const HEADLINE_MIN   =  1;
  const ADJUST_SCROLL  =  0;
  const SCROLL_TIME_PC    = 400;
  const SCROLL_TIME_TOUCH =   0;
  const TOC_INSIDE_SCROLL = true;
  const TOC_TITLE_TOP   = true;
  const SCROLL_SHADOW   = false;
  const LINK_HISTORY    = true;
  const DELAY_GET_DOM   = false;
  const DELAY_TIME_DOM  =  250;
  const DELAY_TIME_LOAD = 1000;
  const GLOBAL_HEADER   = ['#globalheader-container'];
  const CLICK_UPDATE    = [];
  const CLICK_UPDATE_DELAY = 500;
  const USE_LIST        = 'ol';
  const TOUCH_DEVICE    = 'ontouchstart' in window;
  const TOUCH_DEVICE_DISABLE = false;
  const F_STICKY_MODE    = false;
  const PAUSE_NO_SIDEBAR = true;
  const PAUSE_MAIN_SMALL = true;
  // -------------- ↑設定ここまで↑ --------------

  const t=window,e=document,n="stoc",o="stoc-module",i="stoc-title",r="stoc-body",s="stoc-guide",l="stoc-sub-guide",c="hatena-module-title",a="entry-title",f="entry-title-link",u="fade-in",d="touch",E="shadow",m="active",g="tracking",h="fixed",p="absolute",T="static",_="fixed",L="absolute",A="sticky",C=["marginTop","marginBottom"],I=["paddingTop","borderTopWidth","paddingBottom","borderBottomWidth"],y=TOUCH_DEVICE?SCROLL_TIME_TOUCH:SCROLL_TIME_PC,O=y>0;function N(t){return t+"px"}function D(){return e.createElement("div")}const M=function(){const t=/[&'"<>]/g,e={"&":"&amp;","'":"&#39;",'"':"&quot;","<":"&lt;",">":"&gt;"};function n(t){return e[t]}return function(e){return"string"!==typeof e?e:e.replace(t,n)}}(),v=function(){const t={};return function(e){const n=e.id.replace(/[-]./g,function(t){return t.charAt(1).toUpperCase()});if(!t[n]){const o=getComputedStyle(e,null);if(!n)return o;t[n]=o}return t[n]}}();function B(t){let n=[];const o=t.charAt(0),i=t.slice(1);return"#"===o?n[0]=e.getElementById(i):"."===o&&(n=e.getElementsByClassName(i)),n}function S(t,e){const n=parseFloat(v(t)[e]);return n}function R(t,e){let n=t.offsetHeight;return e&&(n+=U(t,C)),n}function b(e,n){return e.getBoundingClientRect().top+(void 0!==n?n:t.pageYOffset)}const H=function(){const e=1e3/30,n=t.scrollTo,o=t.performance?performance:Date;let i,r,s,l;{const e="requestAnimationFrame";(l=Object.prototype.hasOwnProperty.call(t,e))?(r=t[e],s=t.cancelAnimationFrame):(r=t.setTimeout,s=t.clearTimeout)}function c(t){return t<.5?2*t*t:(4-2*t)*t-1}return function(a,f){const u=o.now(),d=t.pageYOffset,E=t.pageXOffset,m=a-d;let g;s(i),i=r(l?function t(e){g=e-u;if(g>=f)return void n(E,a);n(E,c(g/f)*m+d);i=r(t)}:function t(){g=o.now()-u;if(g>=f)return void n(E,a);n(E,c(g/f)*m+d);i=r(t,e)})}}();function U(t,e){let n=0;const o=v(t);for(let t=0,i=e.length;t<i;t++){const i=parseFloat(o[e[t]]);isNaN(i)||(n+=i)}return n}function P(){const P=e.getElementById(n);if(!P)return;const k=P.parentNode.parentNode,x=P.parentElement,Y=k.style,w=e.body.classList;let X;for(let t=0,e=PAGES.length;t<e;t++)if(w.contains(PAGES[t].class)){if(!PAGES[t].display)break;X=PAGES[t];break}if(!X)return void kt();const F=X.listPage,j=X.title,K=e.getElementById("main-inner");let Q=!1;if(!F){const t=K.getElementsByClassName("table-of-contents")[0];if(t){const e=t.getElementsByTagName("a");for(let t=0,n=e.length;t<n;t++)e[t].addEventListener("click",xt,!1);Q=!0}}if(TOUCH_DEVICE_DISABLE)return void kt();let V=[],q=[];if(F){const t=["hentry","archive-entry"];for(let e=0,n=t.length;e<n&&!((V=K.getElementsByClassName(t[e])).length>1);e++);const e=K.getElementsByClassName(f);for(let t=0,n=e.length;t<n;t++)q[t]=e[t].textContent}else V=K.getElementsByClassName("hentry")[0].getElementsByClassName("entry-content")[0].querySelectorAll(HEADLINE_QUERY.join());if(V.length<=HEADLINE_MIN)return void kt();let W=[],J=0;for(let t=0,e=V.length;t<e;t++){const e=V[t],n=F?q[t]:e.textContent;let o,i=0;if(Q?o=e.id:(o="section"+t,e.setAttribute("id",o)),W[t]='<li><a href="#'+o+'">'+M(n)+"</a>",F)continue;const r=e.nodeName.toLowerCase();for(let t=1,e=HEADLINE_QUERY.length;t<e;t++)if(r===HEADLINE_QUERY[t]){i=t;break}for(;J<i;)W[t]="<"+USE_LIST+">"+W[t],J++;for(;J>i;)W[t]="</"+USE_LIST+"></li>"+W[t],J--}let z,Z=!1;""!==j&&(z=F||j!==a?j:K.getElementsByClassName(f)[0].textContent);const $=k.getElementsByClassName(c)[0];if($&&k.removeChild($),z){const e=M(z),n=D();n.id=i,n.className=c,n.innerHTML=TOC_TITLE_TOP?'<a href="#">'+e+"</a>":e,Z=k.insertBefore(n,k.firstElementChild),TOC_TITLE_TOP&&Z.getElementsByTagName("a")[0].addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),O?H(0,y):t.scrollTo(t.pageXOffset,0)},!1)}x.id=r;const tt=e.createElement("ol");tt.innerHTML=W.join(""),P.appendChild(tt),k.setAttribute("id",o);const et=P.getElementsByTagName("a"),nt=[];for(let t=0,e=et.length;t<e;t++)et[t].addEventListener("click",xt,!1),nt[t]=et[t].classList;const ot=e.getElementById("main"),it=e.getElementById("box2"),rt=k.classList,st=[];for(let t=0,e=GLOBAL_HEADER.length;t<e;t++){const e=B(GLOBAL_HEADER[t]);e[0]&&st.push(e[0])}const lt=W.length-1;let ct,at,ft,ut,dt,Et,mt,gt,ht,pt,Tt,_t=[],Lt=!1;const At={};At[L]={left:""},At[_]={},At[T]={},SCROLL_SHADOW&&P.classList.add(E),TOUCH_DEVICE&&(P.classList.add(d),rt.add(d));let Ct,It,yt,Ot=!1;if(TOUCH_DEVICE||F_STICKY_MODE){const t=["-webkit-"+A,A],e=D().style;for(let n=0,o=t.length;n<o;n++)if(e.position=t[n],Ot=-1!==e.position.indexOf(A)){rt.add("sticky");break}}const Nt=k.parentNode,Dt=Nt.children,Mt=Dt.length,vt=D();let Bt;vt.id=s,vt.className="hatena-module",vt.style.cssText=["visibility: hidden;","height: 0;","margin-top: 0;","margin-bottom: 0;","padding-top: 0;","padding-bottom: 0;","border-top: 0;","border-bottom: 0;"].join(""),1===Mt?(Ct=Nt.insertBefore(vt,k),yt=!0):(yt=Dt[Mt-1]===k)?((It=k.previousElementSibling).id=l,Ct=Nt.insertBefore(vt,k)):Ct=Nt.appendChild(vt),t.addEventListener("resize",function(){clearTimeout(Bt),Bt=setTimeout(Xt,200)},!1),k.addEventListener("animationend",function(){rt.remove(u)},!1);const St=function(){let t=-1;return function(e){if(e!==t){if(t>=0&&nt[t].remove(m),t=e,e<0)return;let n=et[e];nt[e].add(m),TOC_INSIDE_SCROLL&&pt&&Lt&&(P.scrollTop=n.offsetTop+n.offsetHeight-ht)}}}(),Rt=function(){let t=0;return{update:function(e,n){return!(e===t||!ut)&&(n&&n(t),t=e,!0)},get:function(){return t},set:function(e){t=e}}}(),bt=Rt.update,Ht=Rt.get,Ut=Rt.set,Pt=function(){let e=!1;return function(n){n!==e&&(e?t.removeEventListener("scroll",Ft,!1):t.addEventListener("scroll",Ft,!1),e=n)}}();function Gt(){let e;Xt();for(let t=0,n=CLICK_UPDATE.length;t<n;t++){const n=B(CLICK_UPDATE[t]);for(let t=0,o=n.length;t<o;t++)n[t].addEventListener("click",function(){clearTimeout(e),e=setTimeout(Xt,CLICK_UPDATE_DELAY)},!1)}t.addEventListener("load",function(){setTimeout(Xt,DELAY_TIME_LOAD)},!1)}function kt(){Y.display="none"}function xt(n){n.preventDefault();const o=decodeURIComponent(n.currentTarget.hash),i=b(e.getElementById(o.substr(1)))-dt+ADJUST_SCROLL;O?H(Math.min(i,ct),y):t.scrollTo(t.pageXOffset,i),LINK_HISTORY&&t.history.pushState(null,o,o)}function Yt(t){P.style.maxHeight=t?N(ht):"",pt=t}function wt(t){const e=At[t];Lt=t!==T,Object.keys(e).forEach(function(t){Y[t]=e[t]}),Lt?rt.add(g):rt.remove(g),_===t?rt.add(h):rt.remove(h),L===t?rt.add(p):rt.remove(p),Yt(Lt)}function Xt(){function n(t,e,n){if(Pt(t),ut=e,t&&e)n();else if(Ut(0),wt(T),Ot&&(Nt.style.height=""),!t)for(let t=0,e=nt.length;t<e;t++)nt[t].remove(m)}function o(t,e,n){let o;const i=e.style,r=i[n];return i[n]="",o=R(t,!0),i[n]=r,o}function i(t,e){function n(t,e){let n=[];for(let o=0,i=t.length;o<i;o++)n[o]=S(t[o],e);return Math.max.apply(null,n)}function o(t,e){const n=t.length-1,o=2*e;if(n>0)for(let e=0;e<n;e++)for(let n=0;n<2;n++)if(S(t[e],I[n+o])>0)return t.slice(0,e+1);return t}const i=n(o(t,0),C[0]),r=n(o(e,1),C[1]);return 0===i||0===r?0:Math.min(i,r)}const r=t.innerHeight,s=r-e.documentElement.clientHeight,l=Math.max(R(e.getElementById("wrapper")),R(ot));ct=Math.max(e.documentElement.scrollHeight-r,0),dt=0;for(let t=0,e=st.length;t<e;t++)dt+=v(st[t]).position===_?R(st[t]):0;Et=dt+MARGIN_TOP,gt=Ct.getBoundingClientRect().left+t.pageXOffset;const c=rt.contains(g);c||rt.add(g);const a=U(k,I)+U(x,I.concat(C)),f=Z?R(Z,!0)+i([x],[Z]):0;if(ht=r-s-Et-MARGIN_BOTTOM-a-f,MAX_HEIGHT){const t=MAX_HEIGHT-a-f;ht>t&&(ht=t)}rt.remove(g);for(let t=0,e=V.length;t<e;t++)_t[t]=b(V[t])-dt;if(Y.width=v(Ct).width,St(-1),MATCH_MEDIA?t.matchMedia(MEDIA_QUERY_SIDEBAR).matches:"none"!==v(it).cssFloat)if(o(it,Nt,"height")>l){if(n(!PAUSE_MAIN_SMALL,!1),PAUSE_MAIN_SMALL)return}else n(!0,!0,function(){Yt(Lt),Ut(-1),Tt=0;const t=R(K),n=function(t,e,n){let o=[];const i=t.classList,r=n.filter(function(t){return i.contains(t)});return r.forEach(function(t){i.remove(t)}),e.forEach(function(e){o.push(S(t,e))}),r.forEach(function(t){i.add(t)}),o}(k,["marginTop","marginLeft"],[g,h,p]),s=n[0],l=n[1];gt-=l,Ot&&(Nt.style.height=N(t)),at=b(Ct)-dt+s+ADJUST_FIXED,It&&(at-=i(Z?[k,Z]:[k],[It,It.children[1]])),yt?at-=MARGIN_TOP:Lt&&(at+=o(k,P,"maxHeight"));const c=Math.min(r-Et,R(k));ft=b(K)+t-c-Et,mt=Ct.offsetParent!==e.body?b(Ct.offsetParent):0,At[_].top=N(Et-s),At[L].top=N(ft-mt+Et-s)});else if(n(!PAUSE_NO_SIDEBAR,!1),PAUSE_NO_SIDEBAR)return;c&&rt.add(g),Ft()}function Ft(){const e=t.pageYOffset,n=t.pageXOffset;if(ft<e?bt(2)&&(wt(L),Tt=0):at<e?bt(1,function(t){yt||0!==t||rt.add(u),wt(_)}):bt(0)&&wt(T),Ot||1!==Ht()||n===Tt||(Y.left=N(gt-n),Tt=n),e<=_t[0]-CURRENT_MARGIN)St(0);else if(ct-e<=CURRENT_MARGIN)St(lt);else for(let t=lt;t>=0;t--)if(e>_t[t]-CURRENT_MARGIN){St(t);break}}DELAY_GET_DOM?Gt():G(Gt)}function G(e){t.addEventListener("DOMContentLoaded",function(){setTimeout(e,DELAY_TIME_DOM)},!1)}DELAY_GET_DOM?G(P):P();
}());
