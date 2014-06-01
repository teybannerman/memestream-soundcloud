(function() {

  $(function() {

    var SOUNDCLOUD_ID, USER_ID;
    SOUNDCLOUD_ID = "ddd1a518196f22519fc5ca02ca4a4fc7";

    SC.initialize({
      client_id: SOUNDCLOUD_ID,
      redirect_uri: "http://localhost:4000/callback.html"
    });

    $('.signin').click(function() {
      SC.connect(function(){
        SC.get("/me", function(user, error){
          if(error){
            alert("Error: " + error.message);
          }else{
            USER_ID = user.id;
            $('.panel-selector h1').append(user.username);
            $('.panel').hide(500);
            getTracks(USER_ID);
          }
        });
      });
    });

  });
}).call(this);


function getTracks(uid) {
  SC.get("/me/tracks", function(tracks, error){
    if(error){
      alert("Error: " + error.message);
    }else{
      $('.panel-selector').show(500);
      $('.app-nav').show(500);
      console.log(tracks);
    }
  });
}