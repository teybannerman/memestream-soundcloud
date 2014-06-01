(function() {

  $(function() {

    var SOUNDCLOUD_ID, USER_ID, IMGUR_KEY;
    SOUNDCLOUD_ID = "ddd1a518196f22519fc5ca02ca4a4fc7";
    IMGUR_KEY = "d93eaa3187ee692";

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
            getImages(IMGUR_KEY);
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

function getImages(key, cat) {
  $.ajax({
    url: 'https://api.imgur.com/3/gallery/g/memes',
    type: 'GET',
    headers: {
      Authorization: 'Client-ID ' + key,
    },
    dataType: 'json'
  }).success(function(data) {
    console.log(data);
  }).error(function() {
    alert('Could not reach api.imgur.com. Sorry :(');
  });
}