/**
 * Created by yyh on 2017/8/7.
 */
(function(root, factory){
	if(typeof module !== 'undefined' && typeof exports == 'object'){
		module.exports = factory();
	}else if(typeof define === 'function' && define.amd ){
		define('GifControl', [], factory);
	}else if(typeof exports === 'object'){
		exports['GifControl'] = factory();
	}else{
		root['GifControl'] = factory();
	}
})(this, function(){
	var playBtnSize = 60;

	function createContainer(el, w, h, options){
		var con, playBtn, cls, id, playBtn, playBtnStyles, playBtnCls, playBtnIcon, playBtnIconStyles, playBtnIconCls;
		con = document.createElement('button');
		playBtn = document.createElement('div');
		playBtnIcon = document.createElement('div')
		playBtnStyles = options && options.playBtnStyles ? parseStyles(options.playBtnStyles) : 'width:' + playBtnSize + 'px; height:' + playBtnSize + 'px;' +
			' position:absolute; background: rgba(0, 0, 0, .3); border-radius:50%; top:50%; left:50%;' +
			' margin-top:-' + playBtnSize/2 + 'px; margin-left:-'  + playBtnSize/2 + 'px';
		playBtnCls = options && options.playBtnCls;

		playBtnIconStyles = options && options.playBtnIconStyles ? parseStyles(options.playBtnIconStyles) : 'width:0; height:0; border:15px solid transparent;' +
			' border-left-color: rgba(0, 0, 0, .5); margin-left: 23px; margin-top: 15px;';
		playBtnIconCls = options && options.playBtnIconCls;
		cls = el.getAttribute('class');
		id = el.getAttribute('id');

		cls ? con.setAttribute('class', cls) : null;
		id ? con.setAttribute('id', id) : null;

		playBtnCls ? playBtn.setAttribute('class', playBtnCls) : null;
		playBtn.setAttribute('style', playBtnStyles);
		playBtnIconCls ? playBtnIcon.setAttribute('class', playBtnIconCls) : null;
		playBtnIcon.setAttribute('style', playBtnIconStyles);

		playBtn.appendChild(playBtnIcon);
		con.appendChild(playBtn);

		el.parentNode.replaceChild(con, el);
		return {
			c: con,
			p: playBtn
		}
	}
	function calPercentageDim(con, w, h, imgW, imgH){
		var ratio = imgW/imgH,
			parentW = con.parentNode.offsetWidth,
			parentH = con.parentNode.offsetHeight;
		if(w.toString().indexOf('%') > 0){
			w = parseInt(w.toString().replace('%',''))/100*parentW ;
			h = w / ratio;
		}else if(h.toString().indexOf('%') > 0){
			h = parseInt(h.toString().replace('%',''))/100*parentH ;
			w = h * ratio;
		}
		return {
			w: w,
			h: h
		}
	}
	function parseStyles(obj){
		var ret = '';
		for(key in obj){
			ret += (key + ':' + obj[key] + ';')
		}
		return ret;
	}
	function process(el, gifs, options){
		var url, w, h, canv, canvSupport, cc, con, playBtn, dimsImg, playing = false, gif;
		url = el.getAttribute('data-gif');
		w = el.getAttribute('data-gif-width');
		h = el.getAttribute('data-gif-height');
		canv = document.createElement('canvas');
		canvSupport = canv.getContext && canv.getContext('2d');

		if(w && h && canvSupport){
			cc = createContainer(el, w, h, options);
		}

		el.src = url;
		el.onload = function(){
			if(!canvSupport) return;
			w = w || el.width;
			h = h || el.height;
			if(!cc){
				cc = createContainer(el, w, h, options);
			}
			con = cc.c;
			playBtn = cc.p;
			dimsImg = calPercentageDim(con, w, h, el.width, el.height);
			canv.width = dimsImg.w;
			canv.height = dimsImg.h;
			canv.getContext('2d').drawImage(el, 0, 0, dimsImg.w, dimsImg.h);
			con.appendChild(canv);
			gifs.push(con);


			con.setAttribute('style','position:relative;cursor:pointer;border:0;padding:0;background:none;' +
				'width:' + dimsImg.w + 'px; height:' + dimsImg.h +　'px');
			//自适应
			canv.setAttribute('style','width:100%; height:100%;');
			if(w.toString().indexOf('%') > -1 && h.toString().indexOf('%') > -1){
				con.style.width = w;
				con.style.height = h;
			}else if(w.toString().indexOf('%') > -1 ){
				con.style.width = w;
				con.style.height = 'inherit';
			}else if(h.toString().indexOf('%') > -1 ){
				con.style.width = 'inherit';
				con.style.height = h;
			}


			con.addEventListener('click', function(){
				if(!playing){
					playing = true;
					gif = document.createElement('img');
					gif.setAttribute('style','width:100%;height:100%');
					gif.src = url;
					con.removeChild(playBtn);
					con.removeChild(canv);
					con.appendChild(gif);
				}else{
					playing = false;
					con.appendChild(playBtn);
					con.appendChild(canv);
					con.removeChild(gif);
					gif = null;
				}
			}, false)
		}

	}

	function GifControl(options){
		var gifs = [], i = 0, images;
		images = document.querySelectorAll('[data-gif]');
		for(i; i < images.length; ++i){
			process(images[i], gifs, options);
		}

		return gifs;
	};

	return GifControl;
})