Screenful.Editor={
  start: function(){
    Screenful.createEnvelope();
    $("#envelope").html("<div id='toolbar'></div><div id='container' class='empty'></div>");
    Screenful.Editor.populateToolbar();
    Screenful.status(Screenful.Loc.ready);
    Screenful.Editor.updateToolbar();
    if(Screenful.Editor.entryID) Screenful.Editor.open(null, Screenful.Editor.entryID);
  },
  populateToolbar: function(){
    var $toolbar=$("#toolbar");
    if(!Screenful.Editor.singleton) {
      if(Screenful.Editor.createUrl) {
    		$("<button id='butNew' class='iconYes'>"+Screenful.Loc.new+"</buttton>").appendTo($toolbar).on("click", Screenful.Editor.new);
    		$("<span class='divider'></span>").appendTo($toolbar);
      }
  		$("<input id='idbox'/>").appendTo($toolbar).on("keyup", function(event){
  			if(event.which==27) $("#idbox").val(Screenful.Editor.entryID);
  			if(event.which==13) Screenful.Editor.open(event);
  		  });
  		$("<button id='butOpen' class='iconOnly mergeLeft noborder'>&nbsp;</buttton>").appendTo($toolbar).on("click", Screenful.Editor.open);
  		$("<span class='divider'></span>").appendTo($toolbar);
  	}
    if(Screenful.Editor.viewer) {
  		$("<button id='butEdit' class='iconYes'>"+Screenful.Loc.edit+"</buttton>").appendTo($toolbar).on("click", Screenful.Editor.edit);
  		$("<button id='butView' class='iconYes'>"+Screenful.Loc.cancel+"</buttton>").appendTo($toolbar).on("click", Screenful.Editor.view);
  	}
    $("<button id='butSave' class='iconYes'>"+Screenful.Loc.save+"</buttton>").appendTo($toolbar).on("click", Screenful.Editor.save);
    if(!Screenful.Editor.singleton && Screenful.Editor.deleteUrl) {
      $("<button id='butDelete' class='iconYes noborder'>"+Screenful.Loc.delete+"</buttton>").appendTo($toolbar).on("click", Screenful.Editor.delete);
    }
  },
  entryID: null,
  updateToolbar: function(){
    if($("#container").hasClass("empty")) { //we have nothing open
      $("#butEdit").hide();
      $("#butView").hide();
      $("#butNonew").hide();
      $("#butSave").hide();
      $("#butDelete").hide();
    } else if(!Screenful.Editor.entryID){ //we have a new entry open
      $("#butEdit").hide();
      $("#butView").hide();
      $("#butNonew").show();
      $("#butSave").show();
      $("#butDelete").hide();
    } else if(Screenful.Editor.entryID && $("#viewer").length>0){ //we have an existing entry open for viewing
      $("#butEdit").show();
      $("#butView").hide();
      $("#butNonew").hide();
      $("#butSave").hide();
      $("#butDelete").show();
    } else if(Screenful.Editor.entryID && $("#editor").length>0){ //we have an existing entry open for editing
      $("#butEdit").hide();
      $("#butView").show();
      $("#butNonew").hide();
      $("#butSave").show();
      $("#butDelete").show();
    }
  },
  new: function(event){
    id=$("#idbox").val("");
    Screenful.Editor.entryID=null;
    $("#container").removeClass("empty").html("<div id='editor'></div>");
    Screenful.Editor.editor(document.getElementById("editor"));
    $("#container").hide().fadeIn();
    Screenful.status(Screenful.Loc.ready);
    Screenful.Editor.updateToolbar();
    if(window.parent!=window && window.parent.Screenful && window.parent.Screenful.Navigator) window.parent.Screenful.Navigator.setEntryAsCurrent(null);
  },
  edit: function(event, id){
    if(!id) id=Screenful.Editor.entryID;
    if(id) {
      var url=Screenful.Editor.readUrl;
      $("#container").html("").addClass("empty");
      Screenful.Editor.entryID=null;
      Screenful.Editor.updateToolbar();
      Screenful.status(Screenful.Loc.reading, "wait"); //"reading entry"
      $.ajax({url: url, dataType: "json", method: "POST", data: {id: id}}).done(function(data){
        if(!data.success) {
          Screenful.status(Screenful.Loc.readingFailed, "warn"); //"failed to read entry"
        } else {
          Screenful.Editor.entryID=data.id;
          $("#idbox").val(data.id);
          $("#container").removeClass("empty").html("<div id='editor'></div>");
          Screenful.Editor.editor(document.getElementById("editor"), data);
          $("#container").hide().fadeIn();
          Screenful.status(Screenful.Loc.ready);
          Screenful.Editor.updateToolbar();
          if(window.parent!=window && window.parent.Screenful && window.parent.Screenful.Navigator) window.parent.Screenful.Navigator.setEntryAsCurrent(data.id);
        }
    	});
    }
  },
  view: function(event, id){
	if(!Screenful.Editor.viewer) Screenful.Editor.edit(event, id);
	else {
		if(!id) id=Screenful.Editor.entryID;
		if(id) {
		  var url=Screenful.Editor.readUrl;
		  $("#container").html("").addClass("empty");
		  Screenful.Editor.entryID=null;
		  Screenful.Editor.updateToolbar();
      Screenful.status(Screenful.Loc.reading, "wait"); //"reading entry"
		  $.ajax({url: url, dataType: "json", method: "POST", data: {id: id}}).done(function(data){
  			if(!data.success) {
          Screenful.status(Screenful.Loc.readingFailed, "warn"); //"failed to read entry"
  			} else {
  			  Screenful.Editor.entryID=data.id;
  			  $("#idbox").val(data.id);
  			  $("#container").removeClass("empty").html("<div id='viewer'></div>");
          Screenful.Editor.viewer(document.getElementById("viewer"), data);
          $("#container").hide().fadeIn();
  			  Screenful.status(Screenful.Loc.ready);
  			  Screenful.Editor.updateToolbar();
  			  if(window.parent!=window && window.parent.Screenful && window.parent.Screenful.Navigator) window.parent.Screenful.Navigator.setEntryAsCurrent(data.id);
  			}
			});
		}
	}
  },
  open: function(event, id){
    if(!id) id=$.trim( $("#idbox").val() );
    if(!id) {
      $("#container").html("").addClass("empty");
      Screenful.Editor.entryID=null;
      Screenful.status(Screenful.Loc.ready);
      Screenful.Editor.updateToolbar();
      if(window.parent!=window && window.parent.Screenful && window.parent.Screenful.Navigator) window.parent.Screenful.Navigator.setEntryAsCurrent(null);
    } else {
      if($("#editor").length>0 && Screenful.Editor.entryID) Screenful.Editor.edit(event, id);
      else Screenful.Editor.view(event, id);
    }
  },
  save: function(event){
    var id=Screenful.Editor.entryID;
    var content=Screenful.Editor.harvester(document.getElementById("editor"));
    $("#container").addClass("empty");
    if(!id) { //we are creating a new entry
      Screenful.status(Screenful.Loc.saving, "wait"); //"saving entry..."
      $.ajax({url: Screenful.Editor.createUrl, dataType: "json", method: "POST", data: {content: content}}).done(function(data){
        if(!data.success) {
          Screenful.status(Screenful.Loc.savingFailed, "warn"); //"failed to save entry"
        } else {
          Screenful.Editor.entryID=data.id;
          $("#idbox").val(data.id);
          if(Screenful.Editor.viewer) {
      			$("#container").removeClass("empty").html("<div id='viewer'></div>");
            Screenful.Editor.viewer(document.getElementById("viewer"), data);
    		  } else {
      			$("#container").removeClass("empty").html("<div id='editor'></div>");
            Screenful.Editor.editor(document.getElementById("editor"), data);
    		  }
          $("#container").hide().fadeIn();
          Screenful.status(Screenful.Loc.ready);
          Screenful.Editor.updateToolbar();
        }
    	});
    } else { //we are updating an existing entry
      Screenful.status(Screenful.Loc.saving, "wait"); //"saving entry..."
      $.ajax({url: Screenful.Editor.updateUrl, dataType: "json", method: "POST", data: {id: id, content: content}}).done(function(data){
        if(!data.success) {
          Screenful.status(Screenful.Loc.savingFailed, "warn"); //"failed to save entry"
        } else {
          Screenful.Editor.entryID=data.id;
          $("#idbox").val(data.id);
          if(Screenful.Editor.viewer) {
            $("#container").removeClass("empty").html("<div id='viewer'></div>");
            Screenful.Editor.viewer(document.getElementById("viewer"), data);
		      } else {
			      $("#container").removeClass("empty").html("<div id='editor'></div>");
            Screenful.Editor.editor(document.getElementById("editor"), data);
		      }
          $("#container").hide().fadeIn();
          Screenful.status(Screenful.Loc.ready);
          Screenful.Editor.updateToolbar();
        }
    	});
    }
  },
  delete: function(event){
    var id=Screenful.Editor.entryID;
    if(confirm(Screenful.Loc.deleteConfirm)){ //"are you sure?"
      Screenful.status(Screenful.Loc.deleting, "wait"); //"deleting entry..."
      $.ajax({url: Screenful.Editor.deleteUrl, dataType: "json", method: "POST", data: {id: id}}).done(function(data){
        if(!data.success) {
          Screenful.status(Screenful.Loc.deletingFailed, "warn"); //"failed to delete entry"
        } else {
          Screenful.Editor.entryID=null;
          $("#idbox").val("");
          $("#container").addClass("empty").html("");
          Screenful.status(Screenful.Loc.ready);
          Screenful.Editor.updateToolbar();
        }
    	});
    }
  },
};
$().ready(Screenful.Editor.start);
