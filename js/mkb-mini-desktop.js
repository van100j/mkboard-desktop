(function(window) {
	'use strict';
	
	var gui, tray, menu, clipboard;
	
	if(typeof require !== 'undefined') {
		// Load native UI library
		gui = require('nw.gui');

		// Create a tray icon
		tray = new gui.Tray({ title: 'è + ѝ', icon: 'img/icon.png' });

		// Give it a menu
		//menu = new gui.Menu();
		//menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
		//tray.menu = menu;
		
		clipboard = gui.Clipboard.get();
    } else {
		clipboard = {
			set: function() {}
		};
	}
	
    var document = window.document,
        isShift = false,
        isCaps = false,
        keymap = {
			'upper': {
                192: "\u040d",
                226: "\u00c8"
            },
			'lower': {
                192: "\u045d",
                226: "\u00e8"
            }
		},
        
        DOMManager = function() {
            this.cache = {};
        };
    
    DOMManager.prototype.getById = function(id) {
		return document.getElementById(id) || false;
	};
	
	DOMManager.prototype.getByClass = function(cls) {
		return document.getElementsByClassName(cls) || false;
    };
	
	DOMManager.prototype.addClass = function( id, value, byClass ) {
		var i, l, elems = [];
		
		if( byClass ) {
			elems = this.getByClass(id);
		} else {
			if( (elems = this.getById(id)) ) {
				elems = [ elems ];
			}
		}
	    
        for ( i = 0, l = elems.length; i < l; i++ ) {
            if( !elems[i].classList.contains( value ) ) {
                elems[i].classList.add( value );
            }
        }
	};
	
	DOMManager.prototype.removeClass = function( id, value, byClass ) {
		var i, l, elems = [];
		
		if( byClass ) {
			elems = this.getByClass(id);
		} else {
			if( (elems = this.getById(id)) ) {
				elems = [ elems ];
			}
		}
        for ( i = 0, l = elems.length; i < l; i++ ) {
            if( elems[i].classList.contains( value ) ) {
                elems[i].classList.remove( value );
            }
        }
	};
	
	DOMManager.prototype.setStyle = function( id, style, value ) {
		this.getById(id).style[style] = value;
	}
    
    DOMManager.prototype.hasClass = function( id, name ) {
		return this.getById(id).classList.contains( name );
	}
	
	var domMgr = new DOMManager();
    
    /*
	window.addEventListener("keydown", function(e) {		
		if(e.keyCode == 20) { // Caps Lock
			isCaps = !isCaps;
			if(isCaps) {
				domMgr.addClass('mkkb-cnt', 'mkkb-caps');
				domMgr.addClass('k' + e.keyCode, 'mkkb-clicked');
			} else {
				domMgr.removeClass('mkkb-cnt', 'mkkb-caps');
				domMgr.removeClass('k' + e.keyCode, 'mkkb-clicked');
			}
            
            if( isShift ) {
                domMgr.removeClass('mkkb-cnt', 'mkkb-shift');
                domMgr.removeClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
                isShift = !1;
            }
		} else if(e.keyCode == 16 && !isShift) { // Shift [add]
			isShift = !0;
			domMgr.addClass('mkkb-cnt', 'mkkb-shift');
			domMgr.addClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
		}
	});
	
	window.addEventListener("keyup", function(e) {
		if(e.keyCode == 16 && isShift) {
			isShift = !1;
			domMgr.removeClass('mkkb-cnt', 'mkkb-shift');
			domMgr.removeClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
		} else if(e.keyCode != 20) { // Caps Lock
			domMgr.removeClass('k' + e.keyCode, 'mkkb-clicked');
            
            if( isShift ) {
                domMgr.removeClass('mkkb-cnt', 'mkkb-shift');
                domMgr.removeClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
                isShift = !1;
            }
		}
        
    });
    */
    
    domMgr.getById('mkkb-close-btn').addEventListener('click', function() {
		//domMgr.setStyle('mkkb-cnt', 'display', 'none');
        
        //window.parent.postMessage("close", "*");
		window.close();
	});
	
	domMgr.getById('mkkb-min-btn').addEventListener('click', function() {
		window.minimize();
	});

	// Handle Mouse Clicks:
	(domMgr.getById('mkkb-cnt')).addEventListener('click', function(e) {
		if ( e.target.nodeType === 1) { 
			
			[].forEach.call((domMgr.getById('mkkb-cnt')).querySelectorAll('.mkkb-show'), function(el) {
				el.classList.remove('mkkb-show');
			});
			
			// Char Clicked:
			//if( (" " + e.target.className + " ").replace(/[\n\t\r]/g, " ").indexOf( " mkkb-char " ) > -1 ) {
			if(e.target.classList.contains('mkkb-char')) {
                 var el, idkey = e.target.getAttribute('id').replace('k', ''), ch = getChar(idkey);
                
                //domMgr.getById('mkkb-copy-text').value = ch;
				clipboard.set(ch, 'text');
                
				if(idkey == 192) { // i
					el = (isShift || isCaps) ? 'mkkb-i-upper-selected-text' : 'mkkb-i-selected-text';
				} else {
					el = (isShift || isCaps) ? 'mkkb-e-upper-selected-text' : 'mkkb-e-selected-text';
				}
				
                if( isShift ) {
                    domMgr.removeClass('mkkb-cnt', 'mkkb-shift');
                    domMgr.removeClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
                    isShift = !1;
                }
				
				domMgr.getById(el).classList.add('mkkb-show');
			
			//} else if( (" " + e.target.className + " ").replace(/[\n\t\r]/g, " ").indexOf( " mkkb-shiftBtn " ) > -1 ) { // Shift
            } else if(e.target.classList.contains('mkkb-shiftBtn')) {
				if(isShift) {
					isShift = !1;
					domMgr.removeClass('mkkb-cnt', 'mkkb-shift');
					domMgr.removeClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
				} else {
					isShift = !0;
					domMgr.addClass('mkkb-cnt', 'mkkb-shift');
					domMgr.addClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
                    
                    if( isCaps ) {
                        domMgr.removeClass('mkkb-cnt', 'mkkb-caps');
                        domMgr.removeClass('mkkb-caps', 'mkkb-clicked', 1);
                        isCaps = !1;
                    }
				}
				
				//domMgr.getById( (isShift ? 'mkkb-shift-text' : 'mkkb-shift-off-text') ).classList.add('mkkb-show');
			
			//} else if( (" " + e.target.className + " ").replace(/[\n\t\r]/g, " ").indexOf( " mkkb-caps " ) > -1 ) { // Caps Lock
            } else if(e.target.classList.contains('mkkb-caps')) {
                if(isCaps) {
					isCaps = !1;
					domMgr.removeClass('mkkb-cnt', 'mkkb-caps');
					domMgr.removeClass('k20', 'mkkb-clicked');
				} else {
					isCaps = !0;
					domMgr.addClass('mkkb-cnt', 'mkkb-caps');
					domMgr.addClass('k20', 'mkkb-clicked');
				}
                
                if( isShift ) {
                    domMgr.removeClass('mkkb-cnt', 'mkkb-shift');
                    domMgr.removeClass('mkkb-shiftBtn', 'mkkb-clicked', 1);
                    isShift = !1;
                }
				
				//domMgr.getById( (isCaps ? 'mkkb-caps-lock-text' : 'mkkb-caps-lock-off-text') ).classList.add('mkkb-show');
			}
		}
	});
	
	(domMgr.getById('mkkb-cnt')).addEventListener('webkitAnimationEnd', function(e) {
		e.target.classList.remove('mkkb-show');
	});

	function getChar(code) {
		if (isCaps || isShift) { // isCaps != isShift
			return keymap.upper[code] || '';
		} else {
			return keymap.lower[code] || '';
		}
	}
    
})(this);