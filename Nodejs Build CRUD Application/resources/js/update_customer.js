$(document).ready(function(){
    $("#update_customer_form").submit(function(evt) {
        evt.preventDefault();
        try {
            let customerId = $("#customer_id").val();

            // PREPARE FORM DATA
            let formData = {
                firstname : $("#customer_first_name").val(),
                lastname :  $("#customer_last_name").val(),
                address: $("#customer_address").val(),
                age: $("#customer_age").val()
            }
            
            $.ajax({
                url: '/api/customer/updatebyid/' + customerId + "/",
                type: 'PUT',
                contentType : "application/json",
                data: JSON.stringify(formData),
                dataType : 'json',
                async: false,
                cache: false,
                success: function (response) {
                    let customer = response.customer;
                    let customerString = "{firstname:" + customer.firstname + 
                                                " ,lastname:" + customer.lastname + 
                                                ", address:" + customer.address + 
                                                ", age:" + customer.age  + "}"
                    let successAlert = '<div class="alert alert-success alert-dismissible">' + 
                                            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                            '<strong>' + response.message + '</strong> Customer\'s Info = ' + customerString;
                                        '</div>'

                    // change the updated data for customer table record
                    $("#tr_" + customerId + " td.td_first_name").text(customer.firstname.toUpperCase());
                    $("#tr_" + customerId + " td.td_address").text(customer.address.toUpperCase());

                    $("#response").empty();
                    $("#response").append(successAlert);
                    $("#response").css({"display": "block"});
                },

                error: function (response) {
                    let errorAlert = '<div class="alert alert-danger alert-dismissible">' + 
                                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                        '<strong>' + response.message + '</strong>' + ' ,Error: ' + message.error + 
                                    '</div>';

                    $("#response").empty();                                    
                    $("#response").append(errorAlert);
                    $("#response").css({"display": "block"});
                }
            });
        } catch(error){
            console.log(error);
            alert(error);
        }
    });

    $(document).on("click", "table button.btn_id", function(){
        let id_of_button = (event.srcElement.id);
        let customerId = id_of_button.split("_")[2];
  
        $.ajax({
            url: '/api/customer/findone/' + customerId,
            type: 'GET',
            success: function(response) {
                let customer = response.customer;                
                $("#customer_id").val(customer.id);
                $("#customer_first_name").val(customer.firstname);
                $("#customer_last_name").val(customer.lastname);
                $("#customer_address").val(customer.address);
                $("#customer_age").val(customer.age);
                $("#div_customer_updating").css({"display": "block"});
            },
            error: function(error){
                console.log(error);
                alert("Error -> " + error);
            }
        });        
    });
});