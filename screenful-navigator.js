Screenful.Navigator={
  start: function(){
    Screenful.createEnvelope();
    $("#envelope").html("<div id='navbox'></div><div id='listbox'></div><div id='editbox'></div><div id='critbox' style='display: none'></div>");
    $("#editbox").html("<iframe name='editframe' frameborder='0' scrolling='no' src='"+Screenful.Navigator.editorUrl+"'/>");
    $("#navbox").html("<div class='line1'><button class='iconOnly' id='butCritOpen'>&nbsp;</button><input id='searchbox'/><button id='butSearch' class='iconOnly mergeLeft noborder'>&nbsp;</buttton><button class='iconYes noborder' id='butCritRemove' style='display: none;'>"+Screenful.Loc.removeFilter+"</button></div>");
    $("#searchbox").on("keyup", function(event){
      if(event.which==27) $("#searchbox").val("");
      if(event.which==13) Screenful.Navigator.critGo(event);
    });
    $("#butSearch").on("click", Screenful.Navigator.critGo);
    $("#navbox").append("<div class='line2'><span id='countcaption'>"+Screenful.Loc.howmany(0)+"</span><button class='iconYes noborder' id='butReload'>"+Screenful.Loc.reload+"</button></div>");
    if(!(Screenful.Navigator.critEditor && Screenful.Navigator.critHarvester)) $("#butCritOpen").remove();
    $("#butCritOpen").on("click", Screenful.Navigator.critOpen);
    $("#butReload").on("click", Screenful.Navigator.reload);
    $("#critbox").html("<div id='editor'></div><div class='buttons'><button class='iconYes' id='butCritCancel'>"+Screenful.Loc.cancel+"</button><button class='iconYes' id='butCritGo'>"+Screenful.Loc.filter+"</button></div>");
    $("#butCritCancel").on("click", Screenful.Navigator.critCancel);
    $("#butCritGo").on("click", Screenful.Navigator.critGo);
    $("#butCritRemove").on("click", Screenful.Navigator.critRemove);
    if(Screenful.Navigator.critEditor && Screenful.Navigator.critHarvester) {
      Screenful.Navigator.critEditor(document.getElementById("editor"));
      Screenful.Navigator.critTemplate=Screenful.Navigator.critHarvester(document.getElementById("editor"));
    }
    Screenful.Navigator.list();
    $(document).on("click", function(){
      if(window.frames["editframe"] && window.frames["editframe"].Xonomy) window.frames["editframe"].Xonomy.clickoff();
    });
  },
  list: function(event, howmany, noSFX){
    if(!howmany) howmany=Screenful.Navigator.stepSize;
    Screenful.Navigator.lastStepSize=howmany;
    Screenful.status(Screenful.Loc.listing, "wait"); //"getting list of entries"
    var url=Screenful.Navigator.listUrl;
    var criteria=null; if(Screenful.Navigator.critHarvester) criteria=Screenful.Navigator.critHarvester(document.getElementById("editor"));
    var searchtext=$.trim($("#searchbox").val());
    if(criteria!=Screenful.Navigator.critTemplate) {
      $("#butCritOpen").addClass("on");
      $("#butCritRemove").show();
    } else {
      $("#butCritOpen").removeClass("on");
      $("#butCritRemove").hide();
    }
    if(searchtext!="") $("#butCritRemove").show();
    $.ajax({url: url, dataType: "json", method: "POST", data: {criteria: criteria, searchtext: searchtext, howmany: howmany}}).done(function(data){
      if(!data.success) {
        Screenful.status(Screenful.Loc.listingFailed, "warn"); //"failed to get list of entries"
      } else {
        $("#countcaption").html(Screenful.Loc.howmany(data.total));
        $("#listbox").html("");
        data.entries.forEach(function(entry){
          $("#listbox").append("<div class='entry' data-id='"+entry.id+"'>"+entry.id+"</div>");
          Screenful.Navigator.renderer($("div.entry[data-id=\""+entry.id+"\"]").toArray()[0], entry, searchtext);
          $("div.entry[data-id=\""+entry.id+"\"]").on("click", entry, Screenful.Navigator.openEntry);
        });
        if(!noSFX) $("#listbox").hide().fadeIn();
        if(data.entries.length<data.total){
          $("#listbox").append("<div id='divMore'><button class='iconYes' id='butMore'>"+Screenful.Loc.more+"</button></div>");
          $("#butMore").on("click", Screenful.Navigator.more);
        }
        if(window.frames["editframe"] && window.frames["editframe"].Screenful && window.frames["editframe"].Screenful.Editor) {
          var currentEntryID=window.frames["editframe"].Screenful.Editor.entryID;
          Screenful.Navigator.setEntryAsCurrent(currentEntryID);
        }
        Screenful.status(Screenful.Loc.ready);
      }
    });
  },
  lastStepSize: 0,
  more: function(event){
    Screenful.Navigator.list(event, Screenful.Navigator.lastStepSize+Screenful.Navigator.stepSize);
  },
  openEntry: function(event){
    var entry=event.data;
    if(window.frames["editframe"].Screenful) {
      window.frames["editframe"].Screenful.Editor.open(null, entry.id);
    }
  },
  setEntryAsCurrent: function(id){
    $("#listbox .entry").removeClass("current")
    $("div.entry[data-id=\""+id+"\"]").addClass("current");
  },

  previousCrit: null,
  critOpen: function(event){
    Screenful.Navigator.previousCrit=Screenful.Navigator.critHarvester(document.getElementById("editor")); //save previous criteria for later, in case the user cancels
    $("#curtain").show().one("click", Screenful.Navigator.critCancel);
    $("#critbox").show();
  },
  critCancel: function(event){
    $("#critbox").hide();
    $("#curtain").hide();
    Screenful.Navigator.critEditor(document.getElementById("editor"), Screenful.Navigator.previousCrit); //restore previous criteria
  },
  critGo: function(event){
    $("#critbox").hide();
    $("#curtain").hide();
    $("#listbox").scrollTop(0);
    Screenful.Navigator.list();
  },
  critRemove: function(event){
    if(Screenful.Navigator.critEditor) Screenful.Navigator.critEditor(document.getElementById("editor"));
    $("#searchbox").val("");
    $("#listbox").scrollTop(0);
    Screenful.Navigator.list();
  },
  reload: function(event){
    $("#listbox").scrollTop(0);
    Screenful.Navigator.list();
  },
  refresh: function(){
    Screenful.Navigator.list(null, Screenful.Navigator.lastStepSize, true);
  },
};
$(window).ready(Screenful.Navigator.start);
