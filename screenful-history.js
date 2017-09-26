Screenful.History={
  go: function(entryID){
    $("body").html("<div class='leftie'></div>");
    $.ajax({url: Screenful.History.historyUrl, dataType: "json", method: "POST", data: {id: entryID}}).done(function(data){
      if(!data.length) {
        //no history for this entry
      } else {
        for(var i=0; i<data.length; i++){
          var hist=data[i];
          console.log(hist);
          if(hist.action!="delete") {
            var $div=$("<div class='revision'></div>").appendTo($("body"));
            Screenful.History.drawRevision($div, hist);
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
    $div.append("<span class='label'>Revision "+hist.entry_id+":"+hist.revision_id+"</span>")
    $div.on("click", function(e){ Screenful.History.zoomRevision(hist.revision_id); });
    $div.append("<span class='sourcecode'>XML</span>")
  },
  drawInterRevision: function($div, hist){
    $div.append("<div class='arrowTop'></div>");
    $div.append("<div class='arrowMiddle'></div>");
    $div.append("<div class='arrowBottom'></div>");
    $div.append(hist.action+", "+hist.email+", "+hist.when);
  },
  zoomRevision: function(revision_id){
    console.log(revision_id);
    $(".revision").removeClass("current").each(function(){
      var $this=$(this);
      if($this.data("revision_id")==revision_id) $this.addClass("current");
    });

  }
};
