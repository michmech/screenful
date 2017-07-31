Screenful.Login={
  start: function(){
    Screenful.createEnvelope(true);
    $("#envelope").html("<form id='middlebox'></form>");
    $("#middlebox").append("<div class='field email'><div class='label'>"+Screenful.Loc.username+"</div><input class='textbox'/></div>");
    $("#middlebox").append("<div class='field password'><div class='label'>"+Screenful.Loc.password+"</div><input type='password' class='textbox'/></div>");
    $("#middlebox").append("<div class='field submit'><input class='button' type='submit' value='"+Screenful.Loc.login+"'/></div>");
    $("#middlebox").append("<div class='error' style='display: none'>"+Screenful.Loc.loginError+"</div>");

    $("#middlebox div.field.email input").focus();
    $("#middlebox").on("submit", function(e){
      var email=$("#middlebox div.field.email input").val();
      var password=$("#middlebox div.field.password input").val();
      if(email!="" && password!="") Screenful.Login.login(email, password);
      return false;
    });
  },

  login: function(email, password){
    $.ajax({url: Screenful.Login.loginUrl, dataType: "json", method: "POST", data: {email: email, password: password}}).done(function(data){
      if(data.success) window.location=Screenful.Login.redirectUrl;
      else $("#middlebox div.error").show();
    });
  },


};
$(window).ready(Screenful.Login.start);
