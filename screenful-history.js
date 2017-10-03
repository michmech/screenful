Screenful.History={
  go: function(entryID){
    $("body").html("<div class='leftie'></div>");
    $.ajax({url: Screenful.History.historyUrl, dataType: "json", method: "POST", data: {id: entryID}}).done(function(data){
      if(!data.length) {
        //no history for this entry
      } else {
        for(var i=0; i<data.length; i++){
          var hist=data[i];
          if(hist.action!="delete") {
            var $div=$("<div class='revision'></div>").appendTo($("body"));
            Screenful.History.drawRevision($div, hist);
            if(i==0) Screenful.History.zoomRevision(hist.revision_id, true);
          }
          var $div=$("<div class='interRevision'></div>").appendTo($("body"));
          Screenful.History.drawInterRevision($div, hist);
        }
      }
    });
  },
  drawRevision: function($div, hist){
    $div.data("entry_id", hist.entry_id);
    $div.data("revision_id", hist.revision_id);
    $div.data("content", hist.content);
    $div.on("click", function(e){
      Screenful.History.zoomRevision(hist.revision_id, true);
    });
    if(window.parent.Screenful.Editor.viewer){
      $div.append(" <span class='pretty'></span>")
      $div.find(".pretty").on("click", function(e){
        Screenful.History.zoomRevision(hist.revision_id, false);
        e.stopPropagation();
      });
    }
    $div.append("<span class='label'>"+hist.entry_id+":"+hist.revision_id+"</span>")
  },
  drawInterRevision: function($div, hist){
    $div.append("<div class='arrowTop'></div>");
    $div.append("<div class='arrowMiddle'></div>");
    $div.append("<div class='arrowBottom'></div>");
    $div.append(hist.action+", "+hist.email+", "+hist.when);
  },
  zoomRevision: function(revision_id, asSourceCode){
    $(".revision").removeClass("current").removeClass("pretty").each(function(){
      var $this=$(this);
      if($this.data("revision_id")==revision_id) {
        $this.addClass("current");
        if(!asSourceCode) $this.addClass("pretty");
        var entry_id=$this.data("entry_id");
        var content=$this.data("content");
        if(content){
          var fakeentry={id: entry_id, content: content};
          if(!asSourceCode && window.parent.Screenful.Editor.viewer){
            window.parent.$("#container").removeClass("empty").html("<div id='viewer'></div>");
            window.parent.Screenful.Editor.viewer(window.parent.document.getElementById("viewer"), fakeentry);
          } else {
            window.parent.$("#container").removeClass("empty").html("<div id='editor'></div>");
            window.parent.Screenful.Editor.editor(window.parent.document.getElementById("editor"), fakeentry, true);
          }
          window.parent.$("#container").hide().fadeIn();
        }
      }
    });

  }
};
