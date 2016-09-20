 var cururl = null;
 var rTitle = null;
 var bklist =[];
 var clist = [];
 var tlist = [];
 var nlist = [];
 var flist = [];
 var css = null;
 var js = null;
 var indport = null;


chrome.storage.local.get({'bookmarks':[]}, function (result) {
    bklist = result.bookmarks;
});

$( document ).ready(function(){
});

chrome.runtime.onConnect.addListener(function(port){
    console.info("Port Connect");
    if(port.name=='contpage'){
        indport = port;
        chrome.storage.local.get({"clist":[],"flist":[], "nlist":[], "tlist":[], "css":null, "js":null}, function (r) {
            clist = r.clist;    
            tlist = r.tlist;    
            nlist = r.nlist;    
            flist = r.flist;    
            css = r.css;    
            js = r.js;    
            indport.postMessage({"type":"cfg", "clist":clist, "flist":flist, "nlist":nlist, "tlist":tlist, "css":css, "js":js});
            indport.postMessage({"type":"go"});
        });
        indport.onMessage.addListener(function(msg){
            console.log(msg);
            if(msg.type=="updatebk"){
                cururl = msg.cururl;
                rTitle = msg.rTitle;
                indport.postMessage({"type":"cfg", "clist":clist, "flist":flist, "nlist":nlist, "tlist":tlist, "css":css, "js":js});
                updateBookmarks();
            }
        });

/*
        indport.onDisconnect.addListener(function(){
            indport = null;
            // Judge how similar the link will be
            bklist.push({rTitle:rTitle, cururl:cururl});
            chrome.storage.local.set({'bookmarks':bklist}, function () {
                console.info("Bookmarks Updated Done");
            });
            indport.postMessage({"type":"cfg", "clist":clist, "flist":flist});
        });
*/
    }
});


function updateBookmarks(){
    //Judge the page url?
    // If its in same novel then Replace
    function sameNovel(u1,u2){
        var su1 = u1.split("/");
        var su2 = u2.split("/");
        // avoid last char is /
        if(su1[su1.length-1] == "") su1.pop();
        if(su2[su2.length-1] == "") su2.pop();
        //length:
        console.info(su1);
        console.info(su2);
        if(su1.length!=su2.length){
            return false;
        } else {
           var cr = true; 
           for(var i=0; i<su1.length-1; i++){
            if(su1[i] != su2[i]){
                cr = false;
                break;
            }
           }
           return cr;
        }
    };

    //
    for(var i=0;i<bklist.length;i++){
        console.log(bklist[i]);
        console.log(cururl);
       if(sameNovel(bklist[i].cururl, cururl)){
            bklist = bklist.slice(0,i).concat(bklist.slice(i+1, bklist.length));
            break;
       }
    };

    bklist.push({rTitle:rTitle, cururl:cururl});
    chrome.storage.local.set({'bookmarks':bklist}, function () {
        console.info("Bookmarks Updated Done");
    });
};


