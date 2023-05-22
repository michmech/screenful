Screenful.Facetor={
  panes: [],
  show: function(){
    //console.log("Facetor is showing itself.");
    const scrollTop=$("#leftbox div").scrollTop();
    $("#leftbox").html("<div/>");
    Screenful.Facetor.panes[0].render($("#leftbox div")[0]);
    Screenful.Facetor.greyOrNot();
    if(scrollTop) $("#leftbox div").scrollTop(scrollTop);
  },
  hide: function(){
    if(Screenful.Facetor.panes[0].close) Screenful.Facetor.panes[0].close();
    //console.log("Facetor is hiding itself.");
  },
  report: function(){
    return Screenful.Facetor.panes[0].harvest($("#leftbox div")[0]);
  },
  change: function(){
    Screenful.Facetor.greyOrNot();
    Screenful.Navigator.list();
  },
  greyOrNot: function(){
    $("#leftbox select").each(function(){
      var $this=$(this);
      if($this.val()=="") $this.addClass("empty"); else $this.removeClass("empty");
    });
  },
};
