var serverURL = "http://www.snailinaturtleneck.com/chatterbox/util.php";
var loadedComments = false;

function getHref() {
    return escape(window.content.document.location);
}


function votePage(pm) {
    $.post(serverURL,
           {
	       "vote" : (pm ? 1 : 0),
	       "page" : getHref()
	   },
           function(data){
               if (!data || "value" in data) {
                   return;
               }
               document.getElementById("page-score").value = data.score;
           },
           "json");
}

function voteComment(pm, cid) {
    $.post(serverURL,
           {
	       "vote" : (pm ? 1 : 0),
	       "comment" : cid
	   },
           function(data){
	       loadedComments = false;
	       loadComments();
           });
}

function createLabel(val) {
    l = document.createElement("label");

    var attr = document.createAttribute("value");
    attr.nodeValue = val;
    l.setAttributeNode(attr);

    return l;
}

function loadComments() {
    if (loadedComments) {
	return;
    }

    $.ajax({ "type" : "GET", 
             "url" : serverURL,
             "data" : { "page" : getHref(),
                        "comments" : 1},
             "success" : function(data) {
	      if (data.total == 0) {
		  document.getElementById("comment-status").value = "No comments, yet.";
		  return;
	      }

	      $("vbox#comments").remove();

	      // create the container for a list of comments
	      var commentsBox = document.createElement("vbox");

	      var boxId = document.createAttribute("id");
	      boxId.nodeValue = "comments";
	      commentsBox.setAttributeNode(boxId);

	      for (i=0; i<data.comments.length; i++) {
		  /* for each comment, use:
		   *  -------------------------
		   * |  ^  | username          |
		   * |  #  | ................. |
		   * |  v  | ................. |
		   *  -------------------------
		   *
		   * which is:
		   * <hbox>
		   *  <vbox>
		   *   <image id="up">
		   *   <label id="score">
		   *   <image id="down">
		   *  </vbox>
		   *  <vbox>
		   *   <label id="username"/>
		   *   <label id="comment"/>
		   *  </vbox>
		   * </hbox>
		   */

		  var commentBox = document.createElement("hbox");
		  var scoreBox = document.createElement("vbox");

		  var plusLabel = createLabel("+");
		  var plusAttr = document.createAttribute("onclick");
		  plusAttr.nodeValue = "voteComment(true, '" + data.comments[i]._id + "')";
		  plusLabel.setAttributeNode(plusAttr);

		  var scoreLabel = createLabel(data.comments[i].score);

		  var minusLabel = createLabel("-");
		  var minusAttr = document.createAttribute("onclick");
		  minusAttr.nodeValue = "voteComment(false, '" + data.comments[i]._id + "')";
		  minusLabel.setAttributeNode(minusAttr);

		  scoreBox.appendChild(plusLabel);
		  scoreBox.appendChild(scoreLabel);
		  scoreBox.appendChild(minusLabel);

		  var contentBox = document.createElement("vbox");
		  var userLabel = createLabel(data.comments[i].user + " on "+
					      data.comments[i].date);
		  var contentLabel = createLabel(data.comments[i].comment);

		  contentBox.appendChild(userLabel);
		  contentBox.appendChild(contentLabel);

		  commentBox.appendChild(scoreBox);
		  commentBox.appendChild(contentBox);
		  
		  commentsBox.appendChild(commentBox);
	      }

	      $("#comment-status").before(commentsBox);
	      document.getElementById("comment-status").value = data.total;

	      loadedComments = true;
	  },
          "dataType" : "json",
          "error" : function (XMLHttpRequest, textStatus, errorThrown) {
              if (textStatus == "timeout") {
                  document.getElementById("comment-status").value = "Timed out!";
              } else {
		  document.getElementById("comment-status").value = "An error occured: "+textStatus;
              }
          }});
}

function postComment() {
    var comment = escape(document.getElementById("comment-content").value);
    $.post(serverURL,
	   {"comment" : comment,
	    "page" : getHref()},
	   function(data) {
	       loaded = false;
	       loadComments();
	       document.getElementById("comment-content").value="";
	   });
}


/*
 * Page load/tab change listener
 */

var chatterbox_urlBarListener = {
    QueryInterface: function(aIID)
    {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
    },

    onLocationChange: function(aProgress, aRequest, aURI)
    {
        myExtension.processNewURL(aURI);
    },

    onStateChange: function(a, b, c, d) {},
    onProgressChange: function(a, b, c, d, e, f) {},
    onStatusChange: function(a, b, c, d) {},
    onSecurityChange: function(a, b, c) {}
};

var myExtension = {
    oldURL: null,
  
    init: function() {
        // Listen for webpage loads
        gBrowser.addProgressListener(chatterbox_urlBarListener,
                                     Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
    },
  
    uninit: function() {
        gBrowser.removeProgressListener(chatterbox_urlBarListener);
    },

    processNewURL: function(aURI) {
        if (aURI.spec == this.oldURL)
            return;
    
        // now we know the url is new...
        alert(aURI.spec);
        this.oldURL = aURI.spec;
    }
};

window.addEventListener("load", function() {myExtension.init()}, false);
window.addEventListener("unload", function() {myExtension.uninit()}, false);

/*
 * EO Page load/tab change listener
 */
