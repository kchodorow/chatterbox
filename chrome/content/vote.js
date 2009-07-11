var serverURL = "http://www.snailinaturtleneck.com/chatterbox/util.php";

function getHref() {
    return escape(window.content.document.location);
}


function vote(pm) {
    $.post(serverURL,
           {
	       "vote" : (pm ? 1 : 0),
	       "page" : getHref()
	   },
           function(data){
               alert(data.msg);
           },
           "json");
}

function loadComments() {
    $.get(serverURL,
	  {"comments" : getHref()},
	  function(data) {
	      document.getElementById("comment-status").value = data;
	  }
	  //, "json" //when we're getting a response
	  );
}

function postComment() {
    var comment = escape(document.getElementById("comment-content").value);
    $.post(serverURL,
	   {"comment" : comment,
	    "page" : getHref()},
	   function(data) {
	       loadComments();
	       document.getElementById("comment-content").value="";
	   }
	   //, "json" // when we're getting a response
	   );
}
