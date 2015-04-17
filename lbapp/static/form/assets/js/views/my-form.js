define([
       "jquery", "underscore", "backbone"
      , "views/temp-snippet"
      , "helper/pubsub"
      , "text!templates/app/renderform.html"
], function(
  $, _, Backbone
  , TempSnippetView
  , PubSub
  , _renderForm
){
  return Backbone.View.extend({
    tagName: "fieldset"
    , initialize: function(){
    	console.log("...........................");
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      PubSub.on("mySnippetDrag", this.handleSnippetDrag, this);
      PubSub.on("tempMove", this.handleTempMove, this);
      PubSub.on("tempDrop", this.handleTempDrop, this);
      this.$build = $("#build");
      this.renderForm = _.template(_renderForm);
      this.render();
    }

    , render: function(){
    	console.log("........sdgsdh...................");
      //Render Snippet Views
      this.$el.empty();
      var that = this;
      var containsFile = false;
      _.each(this.collection.renderAll(), function(snippet){
        that.$el.append(snippet);
      });
      
      console.log('collection = '+this.collection.length);
      console.log('--->'+JSON.stringify(this.collection));
      
      var obj = JSON.parse(JSON.stringify(this.collection));
      console.log('obj='+JSON.stringify(obj[0]["title"]));
      console.log('obj.length='+obj.length);

      for (i=0; i < this.collection.length; i++) {
          console.log('field='+obj[i]["title"]);
          console.log("tamanho="+obj[i]["fields"]);
          //console.log('\tattr='+JSON.stringify(obj[i]["fields"]));
          //var keys = Object.keys(obj[i]["fields"]);
          for(var k in obj[i]["fields"]){
        	  console.log('k='+JSON.stringify(obj[i]["fields"][k]));
        	  for(var f in obj[i]["fields"][k]){
        		  //console.log('----f='+JSON.stringify(obj[i]["fields"][k][f]));
        		  console.log('----f>>>'+f+"="+obj[i]["fields"][k][f]);
        	  }
          }
          
          /*for(j=0; j < obj[i]["fields"].length; j++){
        	  console.log('--- attr='+JSON.stringify(obj[i]["fields"][j]));
        	  // Get the keys
        	  var keys = Object.keys(dictionary);
          }*/
      }
      
      
      
      /*for (var k in this.collection) {
          console.log('col='+JSON.stringify(k));
      }
      
      var obj = JSON.parse(JSON.stringify(this.collection));
      console.log("===="+obj);
      for (var k in obj) {
          console.log('obj='+JSON.stringify(k));
      }
      
      for (var m in this.collection.models) {
          console.log('model='+m.fields);          
      }
      
      console.log('zzzz .....'+this.collection.renderAllClean());*/
      
      //console.log(_.map(this.collection.renderAll(), function(e){return e.html()}).join("\n"));
      
      
      $("#render").val(that.renderForm({
        multipart: this.collection.containsFileType(),
        text: _.map(this.collection.renderAllClean(), function(e){return e.html()}).join("\n")
      }));
      this.$el.appendTo("#build form");
      this.delegateEvents();
    }

    , getBottomAbove: function(eventY){
      var myFormBits = $(this.$el.find(".component"));
      var topelement = _.find(myFormBits, function(renderedSnippet) {
        if (($(renderedSnippet).position().top + $(renderedSnippet).height()) > eventY  - 90) {
          return true;
        }
        else {
          return false;
        }
      });
      if (topelement){
        return topelement;
      } else {
        return myFormBits[0];
      }
    }

    , handleSnippetDrag: function(mouseEvent, snippetModel) {
      $("body").append(new TempSnippetView({model: snippetModel}).render());
      this.collection.remove(snippetModel);
      PubSub.trigger("newTempPostRender", mouseEvent);
    }

    , handleTempMove: function(mouseEvent){
      $(".target").removeClass("target");
      if(mouseEvent.pageX >= this.$build.position().left &&
          mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
          mouseEvent.pageY >= this.$build.position().top &&
          mouseEvent.pageY < (this.$build.height() + this.$build.position().top)){
        $(this.getBottomAbove(mouseEvent.pageY)).addClass("target");
      } else {
        $(".target").removeClass("target");
      }
    }

    , handleTempDrop: function(mouseEvent, model, index){
      if(mouseEvent.pageX >= this.$build.position().left &&
         mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
         mouseEvent.pageY >= this.$build.position().top &&
         mouseEvent.pageY < (this.$build.height() + this.$build.position().top)) {
        var index = $(".target").index();
        $(".target").removeClass("target");
        this.collection.add(model,{at: index+1});
      } else {
        $(".target").removeClass("target");
      }
    }
  })
});
