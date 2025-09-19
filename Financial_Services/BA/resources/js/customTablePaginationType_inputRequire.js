/**
 * Sometimes for quick navigation, it can be useful to allow an end user to
 * enter which page they wish to jump to manually. This paging control uses a
 * text input box to accept new paging numbers (arrow keys are also allowed
 * for), and four standard navigation buttons are also presented to the end
 * user.
 *
 *  @name Navigation with text input
 *  @summary Shows an input element into which the user can type a page number
 *  @author [Allan Jardine](http://sprymedia.co.uk)
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').dataTable( {
 *            "sPaginationType": "customInput"
 *        } );
 *    } );
 */

require(['cdf/lib/jquery','cdf/lib/datatables'],function($){

$.fn.dataTableExt.oPagination.customInput = {
    postInit: function(oSettings){
    	// Entry point for external init settings
        return oSettings;
    },
    "fnInit": function ( oSettings, nPaging, fnCallbackDraw )
    {
        var nFirst = document.createElement( 'span' );
        var nPrevious = document.createElement( 'span' );
		var nNext = document.createElement( 'span' );
		var nLast = document.createElement( 'span' );
		var nInput = document.createElement( 'input' );
		var nPage = document.createElement( 'span' );
		var nOf = document.createElement( 'span' );

        //oSettings.oLanguage.sInfo = "Total results _TOTAL_";
        
		nFirst.innerHTML = oSettings.oLanguage.oPaginate.sFirst;
		//nPrevious.innerHTML = oSettings.oLanguage.oPaginate.sPrevious;
		//nNext.innerHTML = oSettings.oLanguage.oPaginate.sNext;
		nLast.innerHTML = oSettings.oLanguage.oPaginate.sLast;
        
        // We want to replace the text by our icons 
        nPrevious.innerHTML = "&nbsp;" ;
        nNext.innerHTML = "&nbsp;" ;

		nFirst.className = "paginate_button first disabled";
		nPrevious.className = "paginate_button previous disabled";
		nNext.className="paginate_button next";
		nLast.className = "paginate_button last";
		nOf.className = "paginate_of";
		nPage.className = "paginate_page";
		nInput.className = "paginate_input";

		if ( oSettings.sTableId !== '' )
		{
			nPaging.setAttribute( 'id', oSettings.sTableId+'_paginate' );
			nPrevious.setAttribute( 'id', oSettings.sTableId+'_previous' );
			nPrevious.setAttribute( 'id', oSettings.sTableId+'_previous' );
			nNext.setAttribute( 'id', oSettings.sTableId+'_next' );
			nLast.setAttribute( 'id', oSettings.sTableId+'_last' );
		}

		nInput.type = "text";
		nPage.innerHTML = "Page ";

		nPaging.appendChild( nFirst );
		nPaging.appendChild( nPrevious );
		nPaging.appendChild( nPage );
		nPaging.appendChild( nInput );
		nPaging.appendChild( nOf );
		nPaging.appendChild( nNext );
		nPaging.appendChild( nLast );
    

		$(nFirst).click( function ()
		{
			var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1,
                $pagination = $(oSettings.aanFeatures.p);
                
				if (iCurrentPage != 1)
				{
				oSettings.oApi._fnPageChange( oSettings, "first" );
				fnCallbackDraw( oSettings );
    			$pagination.find(".paginate_button.first").addClass('disabled');
				$pagination.find(".paginate_button.previous").addClass('disabled');
				$pagination.find(".paginate_button.next").removeClass('disabled');
                $pagination.find(".paginate_button.last").removeClass('disabled');
				}
		} );

		$(nPrevious).click( function()
		{
			var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1,
                $pagination = $(oSettings.aanFeatures.p);
                
				if (iCurrentPage != 1)
				{
				oSettings.oApi._fnPageChange(oSettings, "previous");
					fnCallbackDraw(oSettings);
					if (iCurrentPage == 2)
					{
                        $pagination.find(".paginate_button.first").addClass('disabled');
    					$pagination.find(".paginate_button.previous").addClass('disabled');
					}
                    $pagination.find(".paginate_button.next").removeClass('disabled');
    				$pagination.find(".paginate_button.last").removeClass('disabled');
			}
		} );

		$(nNext).click( function()
		{
            
            var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1,
                $pagination = $(oSettings.aanFeatures.p);
                
    		if (iCurrentPage != Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))) {
				oSettings.oApi._fnPageChange(oSettings, "next");
				fnCallbackDraw(oSettings);
			}
            if (iCurrentPage == (Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))-1)) {
                $pagination.find(".paginate_button.next").addClass('disabled');
            	$pagination.find(".paginate_button.last").addClass('disabled');
            }
                   
            $pagination.find(".paginate_button.first").removeClass('disabled');
    		$pagination.find(".paginate_button.previous").removeClass('disabled');
            
		} );

		$(nLast).click( function()
		{
			var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1,
                $pagination = $(oSettings.aanFeatures.p);
                
				if (iCurrentPage != Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)))
				{
					oSettings.oApi._fnPageChange(oSettings, "last");
					fnCallbackDraw(oSettings);
                    $pagination.find(".paginate_button.first").removeClass('disabled');
    				$pagination.find(".paginate_button.previous").removeClass('disabled');
					$pagination.find(".paginate_button.next").addClass('disabled');
					$pagination.find(".paginate_button.last").addClass('disabled');
				}
		} );

		$(nInput).bind('input keyup', function (e) {
			// 38 = up arrow
            var lastPage = (Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))),
                $pagination = $(oSettings.aanFeatures.p),
                $previous = $pagination.find(".paginate_button.previous"),
                $next = $pagination.find(".paginate_button.next"),
                $first = $pagination.find(".paginate_button.first"),
                $last = $pagination.find(".paginate_button.last");
                
			if (e.which == 38  && lastPage > this.value)
			{
				oSettings.oApi._fnPageChange( oSettings, "next" );
                fnCallbackDraw(oSettings);
			}
			//  40 = down arrow
			else if ( e.which == 40 && this.value > 1 )
			{
				oSettings.oApi._fnPageChange( oSettings, "previous" );
                fnCallbackDraw(oSettings);
			}

			if ( this.value === "" || this.value.match(/[^0-9]/) )
			{
				/* Nothing entered or non-numeric character */
				this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
				return;
			}
            
            var currentPage = this.value; 
            if (currentPage <= 0) {
                currentPage = 1;
            }else if(currentPage >= lastPage+1){
                currentPage = lastPage;
                this.value = currentPage;

            }
            
            if (currentPage > Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))) {
                currentPage = Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength));
            }
            
            if (currentPage == 1) {
                $first.addClass('disabled');
        	    $previous.addClass('disabled');
    			$next.removeClass('disabled');
				$last.removeClass('disabled');
            }
            
            if ((currentPage > 1) && (currentPage < (Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))))) {
                $first.removeClass('disabled');
                $previous.removeClass('disabled');
    			$next.removeClass('disabled');
				$last.removeClass('disabled');
            }
            
            if (currentPage == lastPage) {
                $first.removeClass('disabled');
        		$previous.removeClass('disabled');
				$next.addClass('disabled');
				$last.addClass('disabled');
            }          
            
            //we only want table to render on enter
            if (( !this.value === "" || !this.value.match(/[^0-9]/) ) && e.which == 13)
    		{   oSettings._iDisplayStart = oSettings._iDisplayLength * (currentPage - 1);
                fnCallbackDraw( oSettings );
			}
                		
		} );

		/* Take the brutal approach to cancelling text selection */
		$('span', nPaging).bind( 'mousedown', function () { return false; } );
		$('span', nPaging).bind( 'selectstart', function () { return false; } );
		
		// If we can't page anyway, might as well not show it
		var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
		if(iPages <= 1)
		{
			$(nPaging).hide();
		}else{
			$(nPaging).show();
		}
        
        // Override external settings:
        $.extend(oSettings,this.postInit(oSettings));
        
        
	},

    postUpdate: function(oSettings){
    	// Entry point for external post update callbacks
    },

	"fnUpdate": function ( oSettings, fnCallbackDraw )
	{
        
    
		if ( !oSettings.aanFeatures.p )
		{
			return;
		}   
		
		var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
		var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;

		var an = oSettings.aanFeatures.p,
		    ani = oSettings.aanFeatures.i,
            total = oSettings.fnRecordsTotal();
            
		    
		if (iPages <= 1) // hide paging when we can't page
		{
			$(an).hide();
			$(ani).hide();
		}
		else
		{
		    $(an).show();
            $(ani).show();
		    
			/* Loop over each instance of the pager */
			for (var i = 0, iLen = an.length ; i < iLen ; i++)
			{
                var span = an[i].getElementsByClassName('paginate_of')[0],
			        input = an[i].getElementsByClassName('paginate_input')[0];
				span.innerHTML = " / " + iPages;
				input.value = iCurrentPage;
			}
		}
        
        this.postUpdate(oSettings);
	}
};
});