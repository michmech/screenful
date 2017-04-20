Screenful.Navigator={
  start: function(){
    Screenful.createEnvelope();
    $("#envelope").html("<div id='navbox'></div><div id='listbox'></div><div id='editbox'></div><div id='critbox' style='display: none'></div>");
    $("#editbox").html("<iframe name='editframe' frameborder='0' scrolling='no' src='"+Screenful.Navigator.editorUrl+"'/>");
    $("#navbox").html("<div class='line1'><button class='iconYes' id='butCritOpen'>scagaire...</button><button class='iconYes noborder' id='butCritRemove' style='display: none;'>bain scagaire</button></div>");
    $("#navbox").append("<div class='line2'><span id='countcaption'>0 iontráil</span><button class='iconYes noborder' id='butReload'>athlódáil</button></div>");
    $("#butCritOpen").on("click", Screenful.Navigator.critOpen);
    $("#butReload").on("click", Screenful.Navigator.reload);
    $("#critbox").html("<div id='editor'></div><div class='buttons'><button class='iconYes' id='butCritCancel'>cealaigh</button><button class='iconYes' id='butCritGo'>gabh</button></div>");
    $("#butCritCancel").on("click", Screenful.Navigator.critCancel);
    $("#butCritGo").on("click", Screenful.Navigator.critGo);
    $("#butCritRemove").on("click", Screenful.Navigator.critRemove);
    Xonomy.render(Screenful.Navigator.critTemplate, document.getElementById("editor"), Xonomy.docSpec);
	Screenful.Navigator.critTemplate=Xonomy.harvest();
    Screenful.Navigator.list();
    $(document).on("click", function(){
      if(window.frames["editframe"] && window.frames["editframe"].Xonomy) window.frames["editframe"].Xonomy.clickoff();
    });
  },
  list: function(event, howmany){
    if(!howmany) howmany=Screenful.Navigator.stepSize;
    Screenful.Navigator.lastStepSize=howmany;
    Screenful.status("Liosta iontrálacha á fháil...");
    var url=Screenful.Navigator.listUrl;
    var criteria=Xonomy.harvest();
    if(criteria!=Screenful.Navigator.critTemplate) {
      $("#butCritOpen").addClass("on");
      $("#butCritRemove").show();
    } else {
      $("#butCritOpen").removeClass("on");
      $("#butCritRemove").hide();
    }
    $.ajax({url: url, dataType: "json", method: "POST", data: {criteria: criteria, howmany: howmany}}).done(function(data){
      if(!data.success) {
        Screenful.status("Níor éirigh liom liosta iontrálacha a fháil.");
      } else {
        $("#countcaption").html(data.total+" iontráil");
        $("#listbox").html("");
        data.entries.forEach(function(entry){
          var html=Screenful.Navigator.renderer(entry.content);
          html="<div class='entry' data-id='"+entry.id+"'>"+html+"</div>";
          $("#listbox").append(html);
          $("div.entry[data-id=\""+entry.id+"\"]").on("click", entry, Screenful.Navigator.openEntry);
        });
        if(data.entries.length<data.total){
          $("#listbox").append("<div id='divMore'><button class='iconYes' id='butMore'>tuilleadh</button></div>");
          $("#butMore").on("click", Screenful.Navigator.more);
        }
        if(window.frames["editframe"] && window.frames["editframe"].Screenful && window.frames["editframe"].Screenful.Editor) {
          var currentEntryID=window.frames["editframe"].Screenful.Editor.entryID;
          Screenful.Navigator.setEntryAsCurrent(currentEntryID);
        }
        Screenful.status("Réidh.");
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
    Screenful.Navigator.previousCrit=Xonomy.harvest(); //save previous criteria for later, in case the user cancels
    $("#curtain").show().one("click", Screenful.Navigator.critCancel);
    $("#critbox").show();
  },
  critCancel: function(event){
    $("#critbox").hide();
    $("#curtain").hide();
    Xonomy.render(Screenful.Navigator.previousCrit, document.getElementById("editor"), Xonomy.docSpec); //restore previous criteria
  },
  critGo: function(event){
    $("#critbox").hide();
    $("#curtain").hide();
    $("#listbox").scrollTop(0);
    Screenful.Navigator.list();
  },
  critRemove: function(event){
    Xonomy.render(Screenful.Navigator.critTemplate, document.getElementById("editor"), Xonomy.docSpec);
    $("#listbox").scrollTop(0);
    Screenful.Navigator.list();
  },
  reload: function(event){
    $("#listbox").scrollTop(0);
    Screenful.Navigator.list();
  },
};
$().ready(Screenful.Navigator.start);
