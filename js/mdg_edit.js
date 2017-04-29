$(function() {
	var selected = null;
	
	new resizebar('#rb','#edit',"v",1) ;
		
	var mag = 1.0 ;
	$('#base').css('width',"2900px").css('height',"2000px") ;

	$('#zoom').on("input",function() {
		mag = $(this).val()/100 ;
		$('#szoom').html("#base {transform: scale("+mag+")}");
		$('#zoomText').val(mag);

		savelocal();
	})
	$('#size_x,#size_y').on('change',function(ev){
		$('#base').css(($(this).attr('id')=="size_x")?'width':'height',parseInt($(this).val())+"px") ;
	})


	var b = new mdg_draw($('#base')) ;
	var p = loadlocal() ;
	if(p) {
		$('#source').val( p.source ) ;
		$('#i_fname').val(p.fname ) ;
		$('#edit').css('width', p.width);
		$('#zoom').val(p.zoom * 100);
		$('#zoom').trigger('input');
	}
	var data = b.parse($('#source').val())  ;
	b.setobj(data,true) ;
	
	function loadlocal() {
		var ret = null ;
		if(p = window.localStorage.getItem("mdg")) {
			if(JSON.parse(p) && JSON.parse(p).sources) {
				ret = JSON.parse(p).sources[0] ;
			}
		}
		return ret ;
	}
	
	function savelocal() {
		var s = $('#source').val();
		var f = $('#i_fname').val();
		var w = $('#edit').css('width');
		var o = {source:s, fname:f, zoom:mag, width:w};
		window.localStorage.setItem("mdg",JSON.stringify({sources:[o]})) ;
	}

	$('#source').on('keyup',function() {
		$('#base').trigger('click');
		var s = $(this).val() ;
		data = b.parse(s) ;
//		console.log(data) ;
		b.setobj(data) ;
		savelocal() ;
		bindBoxClick();
	});

	$(document).on("dragstart",'#base .box',function(ev){
		var oe = ev.originalEvent ;
//		console.log("dstart") ;
//		console.log(oe.pageX+"/"+oe.pageY);
		ev.originalEvent.dataTransfer.setData("text",$(this).attr('id')+"/"+oe.pageX+"/"+oe.pageY);
		$('#base').trigger('click');
	});

	$('#base').on("dragenter dragover",function(){
		return false ;
	}).on("drop",function(ev){
//		console.log("drop") ;
		var oe = ev.originalEvent ;
		var k = ev.originalEvent.dataTransfer.getData("text").split("/") ;
		var id = k[0] ;

		var ox = (oe.pageX-k[1])/mag ;
		var oy = (oe.pageY-k[2])/mag ;
//		console.log(ox+"/"+oy) ;
		var em = parseInt($('html').css('font-size')) ;

		var ex = parseInt($('#'+id).css("left")) ;
		var ey = parseInt($('#'+id).css("top")) ;
		var px = Math.floor(((ex+ox)/em+0.25)*2)/2 ;
		var py = Math.floor(((ey+oy)/em+0.25)*2)/2 ;

		b.setpos(id,px,py) ;
		b.redraw(data) ;
		var s = b.upd_text($('#source').val()) ;
		$('#source').val(s) ;
		savelocal() ;
		return false ;
	});

	$('#b_load').on("click",function() {
		$('#f_load').click() ;
	});

	$('#f_load').on("change",function(ev) {
		var f = ev.originalEvent.target.files ;
		var reader = new FileReader();

		reader.onload = (function(e) {
			var src = e.target.result ;
			$('#source').val(src) ;
			data = b.parse(src) ;
			b.setobj(data,true) ;   
			bindBoxClick();
		});
		$('#i_fname').val(f[0].name) ;
		reader.readAsText(f[0]);
	});

	$('#l_save').on("click",function(){
		$(this).attr("download",$('#i_fname').val());
		$(this).attr("href","data:application/octet-stream;charset=UTF-8,"+encodeURIComponent($('#source').val())) ;
		return true ;
	});

	function bindBoxClick() {
		$('.box').on("click", function(e) {
			if (e.shiftKey) {
				if (selected) {
					selected = selected.add($(this));
				}
				else {
					selected = $(this);
				}
				e.stopPropagation();
				var x = $(this).position().left / mag;
				var y = $(this).position().top / mag;
				var w = $(this).width();
				var h = $(this).height();
				var t = $('<div>')
					.addClass('selectBox')
					.attr('data-id', $(this).attr('id'))
					.css({top:y,left:x,width:w,height:h});
				$('#base').append(t);

				// 選択されているエレメントがひとつの時のみソースの該当部分を選択する。
				if (selected.length === 1) {
					var id = $(this).attr("id");
					var m = $('#source').get(0);
					var st = m.value.search(new RegExp('\\n\\['+id+'\\]')) + 1;
					var ss = st + id.length + 2;
					var ed = m.value.substr(ss).search(new RegExp('\\n(//|\\[)')) + 1;
					if (ed <= 0) {
						ed = m.textLength;
					}
					else {
						ed += ss;
					}
					m.setSelectionRange(st,ed);
				}
			}
		});
	}
	bindBoxClick();

	$('#base,#edit').on("click", function(e) {
		selected = null;
		$('.selectBox').remove();
	});

	$('body').on("keydown", function(e) {
		if (selected) {
			if (e.keyCode != 46 && e.keyCode < 37 && e.keyCode > 40) {
				return;
			}
			e.stopPropagation();
			e.preventDefault();

			if (selected.length === 1 && e.keyCode === 46) {
				$('#source').get(0).setRangeText('');
				$('#source').trigger('keyup');
				return;
			}

			if (selected.length === 1 && e.keyCode === 13) {
				openEditDialog();
				return;
			}

			selected.each(function() {
				var ox = 0;
				var oy = 0;
				if (e.keyCode === 38) oy = -0.5;
				if (e.keyCode === 40) oy =  0.5;
				if (e.keyCode === 37) ox = -0.5;
				if (e.keyCode === 39) ox =  0.5;

				var em = parseInt($('html').css('font-size')) ;
				var ex = parseInt($(this).css("left")) ;
				var ey = parseInt($(this).css("top")) ;
				var px = Math.floor((ex/em+0.25)*2)/2 + ox;
				var py = Math.floor((ey/em+0.25)*2)/2 + oy;

				b.setpos($(this).attr('id'),px,py);
				b.redraw(data);
				var s = b.upd_text($('#source').val());
				$('#source').val(s);
				savelocal();
				$('.selectBox[data-id="'+$(this).attr('id')+'"]').css({
					left: $(this).position().left / mag,
					top : $(this).position().top  / mag
				});
			});
		}
	});

	function resizebar(bar,target,hv,dir) {
		this.sw = 0 ;
		this.sel = target ;
		this.dir = dir ;
		this.hv = hv ;
		this.start = null ;
		this.attr = (hv=="v")?"width":"height" ;
		this.mouse = (hv=="v")?"pageX":"pageY" ;
		var self = this ;
		$(bar).on('mousedown touchstart',function(ev) {
			self.sw = parseInt($(self.sel).css(self.attr))-self.dir*ev.originalEvent[self.mouse] ;
			self.start = self.sel ;
		});
		$('body').on('mousemove touchmove',function(ev){
			if(self.start != self.sel) return true ;
			var w = self.dir*ev.originalEvent[self.mouse]+self.sw;
			if(w<100) return false ;
			$(self.sel).css(self.attr,w+"px") ;
			return false ;
		}).on('mouseup touchend',function() {
			savelocal();
			self.start = null ;
		});
	}

	$('#p_source_update').on('click', function() {
		$('#source').get(0).setRangeText($('#p_source').val()+"\n");
		$('#source').trigger('keyup');
		$('#p_source').val('');
		$('#dialog').hide();
		$('.selectBox').remove();
	});

	$('#p_source_cancel').on('click', function() {
		$('#p_source').val('');
		$('#dialog').hide();
		$('.selectBox').remove();
	});

	function openEditDialog() {
		selected = null;

		var s = $('#source');
		var st = s.get(0).selectionStart;
		var ed = s.get(0).selectionEnd;
		$('#dialog').show();
		$('#p_source').val(s.val().substring(st,ed).trim()+"\n").focus();
	}
});
