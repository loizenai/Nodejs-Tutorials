$(document).ready(function(){	
	function fetchCustomers(page, size, salary, agesorting, desc){
		let pageNumber = (typeof page !== 'undefined') ?  page : 0;
		let sizeNumber = (typeof size !== 'undefined') ?  size : 5;
		let selectedsalary = (typeof salary !== 'undefined') ?  salary : -1;
		let ageSorted = (typeof agesorting !== 'undefined') ?  agesorting: false;
		let descDirection = (typeof desc !== 'undefined') ?  desc: false;
	
		/**
		 * Do a fetching to get data from Backend's RESTAPI
		 */
		$.ajax({
		    type : "GET",
		    url : "/api/customers/pagefiltersort",
		    data: { 
		        page: pageNumber, 
		        size: sizeNumber,
		        salary: selectedsalary,
		        agesorting: ageSorted,
		        desc: descDirection
		    },
			success: function(response){
			  $('#customerTable tbody').empty();
			  // add table rows
			  $.each(response.customers, (i, customer) => {  
			    let tr_id = 'tr_' + customer.id;
			    let customerRow = '<tr>' +
			  						  '<td>' + customer.id + '</td>' +
			                		  '<td>' + customer.firstname + '</td>' +
			                		  '<td>' + customer.lastname + '</td>' +
			                		  '<td>' + customer.age + '</td>' +
			                          '<td>' + '$' + customer.salary + '</td>' +
			                          '<td>' + customer.address + '</td>' +
			                          '<td>' + '<a href="https://loizenai.com">' + customer.copyrightby + '</a>' + '</td>' +
			                       '</tr>';
			    $('#customerTable tbody').append(customerRow);
			  });              
	          
			  if ($('ul.pagination li').length - 2 != response.totalPages){
			  	  // build pagination list at the first time loading
				  $('ul.pagination').empty();
			      buildPagination(response.totalPages);
			  }
	        },
	        error : function(e) {
	          alert("ERROR: ", e);
	          console.log("ERROR: ", e);
	        }
	    });    	
	}

    /**
     * Check a string value is a number or NOT
     */
    function isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
    
    /**
     * Select a salary for pagination & filtering
     */
    $("select").change(function() {
    	let salary = -1;
    	
    	if(isNumeric(this.value)){
    		salary = this.value;
    	}
    	
    	let agesorting = false;
    	let desc = false;
    	
    	if($("#age_sorting"). prop("checked") == true){
    		agesorting = true;
    	}
    	
    	if($("#desc_sorting"). prop("checked") == true){
    		desc = true;
    	}
    	
    	// re-fetch customer list again 
        fetchCustomers(0, 5, salary, agesorting, desc);
    });

    /**
     * Get a list of distinct salaries
     */
    function getListSalaries(){
    	$.ajax({
            type : "GET",
            url : "/api/customers/salaries",
            success: function(response){
              $("#selected_form").empty();
              $('#selected_form').append("<option>All</option>");
              $.each(response.sort().reverse(), (i, salary) => {
            	// <option>All</option>
                let optionElement = "<option>" + salary + "</option>";
                $('#selected_form').append(optionElement);
              });              
            },
            error : function(e) {
              alert("ERROR: ", e);
              console.log("ERROR: ", e);
            }
    	});
    }    
    
    /**
     * age_sorting checkbox is changed
     */
    $('#age_sorting').on('change', function() {
        if(this.checked){
        	$("#desc_sorting").removeAttr("disabled");
        	$("#sortingbtn").removeAttr("disabled");
        }else {
        	$("#desc_sorting").attr("disabled", true);
        	$("#desc_sorting").prop("checked", false);
        	$("#sortingbtn").attr("disabled", true);
        }
    }); 
    
    /**
     * Click on sorting Button
     */
    $(document).on("click", "#sortingbtn", function() {
    	let agesorting = false;
    	let desc = false;
    	let selectedSalary = getSeletedSalary();
    	
    	//get value of check boxes
    	
    	/* agesorting checkbox */
    	if($("#age_sorting"). prop("checked") == true){
    		agesorting = true;
    	}
    	
    	/* desc checkbox */
    	if($("#desc_sorting"). prop("checked") == true){
    		desc = true;
    	}
    	
    	// get the active index of pagination bar 
    	let selectedPageIndex = parseInt($("ul.pagination li.active").text()) - 1;
    	
    	// just fetch again customers from SpringBoot RestAPIs when agesorting checkbox is checked
    	if(agesorting){
    		fetchCustomers(selectedPageIndex, 5, selectedSalary, agesorting, desc); // get next page value	
    	}
    });
    
	/**
	 * 
	 * Build the pagination Bar from totalPages
	 */
	function buildPagination(totalPages){
	    // Build paging navigation
	    let pageIndex = '<li class="page-item"><a class="page-link">Previous</a></li>';
	    $("ul.pagination").append(pageIndex);
	    
	    // create pagination
	    for(let i=1; i <= totalPages; i++){
	  	  // adding .active class on the first pageIndex for the loading time
	  	  if(i==1){
	      	  pageIndex = "<li class='page-item active'><a class='page-link'>"
	  				+ i + "</a></li>"            		  
	  	  } else {
	      	  pageIndex = "<li class='page-item'><a class='page-link'>"
		  				+ i + "</a></li>"
	  	  }
	  	  $("ul.pagination").append(pageIndex);
	    }
	    
	    pageIndex = '<li class="page-item"><a class="page-link">Next</a></li>';
	    $("ul.pagination").append(pageIndex);
	}
    
    /**
     * Get the selectedSalary for filtering
     */
    function getSeletedSalary(){
    	if(!isNumeric($("select").val())){
    		return -1;
    	}else return parseInt($("select").val());
    }
    
    /**
     * 
     * Fetching the Customers from SpringBoot RestAPI at the initial time
     */
    (function(){
    	// get first-page at initial time
    	fetchCustomers(0);
    	
    	// get the distinct values of customer's salaries
    	getListSalaries();
    })();
        
    /**
     * Fetch again the customer's data from RestAPI when 
     * 		having any click on pagination bar for pagination filtering and sorting 
     */
	$(document).on("click", "ul.pagination li a", function() {
		let agesorting = false;
		let desc = false;
		let selectedSalary = getSeletedSalary();
		if($("#age_sorting"). prop("checked") == true){
			agesorting = true;
		}
		
		if($("#desc_sorting"). prop("checked") == true){
			desc = true;
		}
		
		let val = $(this).text();
		
		// click on the NEXT tag
	  	if(val.toUpperCase()==="NEXT"){
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		let totalPages = $("ul.pagination li").length - 2; // -2 beacause 1 for Previous and 1 for Next 
	  		if(activeValue < totalPages){
	  			let currentActive = $("li.active");
	  			fetchCustomers(activeValue, 5, selectedSalary, agesorting, desc); // get next page value
	  			// remove .active class for the old li tag
	  			$("li.active").removeClass("active");
	  			// add .active to next-pagination li
	  			currentActive.next().addClass("active");
	  		}
	  	} else if(val.toUpperCase()==="PREVIOUS"){
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		if(activeValue > 1){
	  			// get the previous page
	  			fetchCustomers(activeValue-2, 5, selectedSalary, agesorting, desc);
	  			let currentActive = $("li.active");
	  			currentActive.removeClass("active");
	  			// add .active to previous-pagination li
	  			currentActive.prev().addClass("active");
	  		}
	  	} else {
	  		fetchCustomers(parseInt(val) - 1, 5,  selectedSalary, agesorting, desc);
	  		// add focus to the li tag
	  		$("li.active").removeClass("active");
	  		$(this).parent().addClass("active");
	  	}
	});
});