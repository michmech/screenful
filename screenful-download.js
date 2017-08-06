Screenful.Download={
  start: function(){
    Screenful.createEnvelope(true);
    $("#envelope").html("<form id='middlebox'></form>");
    $("#middlebox").append("<a class='download' href='"+Screenful.Download.url+"'>"+Screenful.Loc.download+" <span class='explanation'>"+Screenful.Download.explanation+"</span></a>");
  },
};
$(window).ready(Screenful.Download.start);
