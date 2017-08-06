Screenful.Upload={
  start: function(){
    Screenful.createEnvelope(true);
    $("#envelope").html("<form id='middlebox'><div class='one'></div><div class='two' style='display: none'></div></form>");
    var form="<form action='"+Screenful.Upload.url+"' method='post' enctype='multipart/form-data' target='frmUploadTarget'>";
    form+="<div class='field'><input class='filebox' type='file' name='myfile'/></div>";
    form+="<div class='field'><label><input type='checkbox' name='purge'/> "+Screenful.Loc.uploadPurge+"</label></div>";
    form+="<div class='field submit'><input class='button' type='submit' value='"+Screenful.Loc.upload+"'/>";
    form+="<div class='error' style='display: none'>"+Screenful.Loc.uploadFail+"</div>";
    form+="</form>";
    $("#middlebox .one").append(form);
    $("#middlebox .two").append("<div class='message'>"+Screenful.Loc.uploadSuccess+"</div>");

    $("#envelope").append("<iframe id='frmUploadTarget' name='frmUploadTarget' src='about:blank' style='width:0;height:0;border:0px solid #fff;'></iframe>");

    $("#middlebox .one form").on("submit", function(){
      $('#frmUploadTarget').one('load', function(){
        var result=( $.trim(window.frames["frmUploadTarget"].document.body.textContent)=="true" ? true : false );
        if(result){
          $("#middlebox .one").hide();
          $("#middlebox .two").show();
          if(Screenful.Upload.redirectUrl) window.location=Screenful.Upload.redirectUrl;
        } else {
          $("#middlebox .two").hide();
          $("#middlebox .one").show();
          $("#middlebox .one .error").show();
        }
			});
    });
  },
};
$(window).ready(Screenful.Upload.start);
