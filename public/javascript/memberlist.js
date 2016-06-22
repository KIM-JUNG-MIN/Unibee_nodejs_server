(function(){

  var searchFilter = {
      options: { valueNames: ['name'] },
      init: function() {
        var userList = new List('people-list', this.options);
        var noItems = $('<li id="no-items-found">No items found</li>');

        userList.on('updated', function(list) {
          if (list.matchingItems.length === 0) {
            $(list.list).append(noItems);
          } else {
            noItems.detach();
          }
        });
      }
    };

    console.log(searchFilter.options);

    searchFilter.init();

})();
.search
  input(type='text', placeholder='search')
  i.fa.fa-search
