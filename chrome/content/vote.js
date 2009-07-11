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
	      alert("hi");
	  });
}

function postComment() {
    return;
}
