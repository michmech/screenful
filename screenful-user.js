Screenful.User={
  start: function(){
    if(Screenful.User.loggedin){
      $(".ScreenfulUser").html("<div class='clickable'>"+Screenful.User.username+" <span class='arrow'>▼</span></div><div class='menu' style='display: none'></div>");
      $(".ScreenfulUser .menu").append("<a href='"+Screenful.User.homeUrl+"'>"+Screenful.Loc.home+"</a>");
      $(".ScreenfulUser .menu").append("<a href='"+Screenful.User.logoutUrl+"'>"+Screenful.Loc.logout+"</a>");
    } else {
      $(".ScreenfulUser").html("<div class='clickable'>"+Screenful.Loc.anonymous+" <span class='arrow'>▼</span></div><div class='menu' style='display: none'></div>");
      $(".ScreenfulUser .menu").append("<a href='"+Screenful.User.homeUrl+"'>"+Screenful.Loc.home+"</a>");
      $(".ScreenfulUser .menu").append("<a href='"+Screenful.User.loginUrl+"'>"+Screenful.Loc.login+"</a>");
    }
    $(".ScreenfulUser .clickable").on("click", function(e){
      $(e.delegateTarget).closest(".ScreenfulUser").find(".menu").hide().slideDown();
      e.stopPropagation();
    });
    $(document).on("click", function(e){
      $(".ScreenfulUser .menu").slideUp();
    });
  },
};
$(window).ready(Screenful.User.start);
