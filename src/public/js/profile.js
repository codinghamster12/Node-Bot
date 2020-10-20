$(document).ready(function(){

    $("#submitFacebookProfile").on("click", function(event){
        event.preventDefault();
        alert('click the button');
        $.ajax({
            url: `${window.location.origin}/set-up-user-fb-profile`,
            method: "POST",
            data: {},
            success: function(data){
                alert('Setup success');
                console.log(data);
            },
            error: function(error){
                console.log(error);
            }
    
        })
    })
   

}
)