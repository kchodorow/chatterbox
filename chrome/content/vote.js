function vote(pm) {
    $.post("http://www.snailinaturtleneck.com/chatterbox",
           {"vote" : (pm ? 1 : 0)},
           function(data){
               alert(data.msg);
           },
           "json");
}
