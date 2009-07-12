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
	       // replace image
	       return;
           },
           "json");
}

function loadComments() {
    $.get(serverURL,
	  {"page" : getHref(),
           "comments" : 1},
	  function(data) {
	      if (data.total == 0) {
		  document.getElementById("comment-status").value = "No comments, yet.";
		  return;
	      }

	      str = "";
	      for (i=0; i<data.comments.length; i++) {
		  str += data.comments[i].user + " says " + data.comments[i].comment+", ";
	      }

	      if (data.total > data.comments.length) {
		  document.getElementById("comment-status").value = "More comments available.";
	      }
	      else {
		  document.getElementById("comment-status").value = str;
	      }
	  }, 
	  "json"
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
