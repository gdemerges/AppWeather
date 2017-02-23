(function($){
   $.cachax = function(url, cacheKey, duration, callback){

      function setStorage(key, value, min){
         var expire = new Date();
         expire.setMinutes(expire.getMinutes() + (min || 0));

         localStorage.setItem(
            key,
            JSON.stringify({
               value: value,
               expires: expire.getTime()
            })
         );
      }

      function getStorage(key){
         if( localStorage.getItem(key) != null ){
            return $.parseJSON( localStorage.getItem(key) );
         }else{
            return null;
         }
      }

      if( ('localStorage' in window) && window['localStorage'] != null ){

         var stored = getStorage(cacheKey);
         var curTimestamp = new Date();

         if(stored !=null && stored.expires > curTimestamp.getTime()){
            callback.call( null, stored.value );
         }else{
            $.get( url, function(response){
               setStorage(cacheKey, response, duration);
               callback.call( null, response );
            });
         }

      }else{
         $.get(url, callback);
      }

   }

})(jQuery);
