
(function() {
    'use strict';
    /**
     * Class constructor for Fullscreen Loading MDL component.
     * 
     * @constructor
     * @param {HTMLElement} element The element that will be upgrade.
     */

    var MaterialFullscreenLoading = function MaterialFullscreenLoading(element) {
        this.element_ = element;
        // Initialize instance.
        this.init();
      };
      window['MaterialFullscreenLoading'] = MaterialFullscreenLoading;


    /**
     *  Handle Window loading.
     */
    MaterialFullscreenLoading.prototype.runLoading = function(state){
        if(state) document.getElementById('materialLoading').className = 'show';
        else document.getElementById('materialLoading').className = 'hide';
    };
    
    /**
    * Initialize element.
     */
    MaterialFullscreenLoading.prototype.init = function() {
        if (this.element_) {
            window.addEventListener('load', function(){
                var ml = document.createElement('div');
                ml.id = 'materialLoading';
                ml.className = 'hide';
                var mlCentered = document.createElement('div');
                mlCentered.id = 'materialLoadingCentered';
                var mlContent = document.createElement('div');
                mlContent.id = 'materialLoadingContent';
                mlContent.innerHTML = '<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>';
                mlCentered.appendChild(mlContent);
                ml.appendChild(mlCentered);
                document.body.appendChild(ml);
            });
        }
    };

    // The component registers itself. It can assume componentHandler is available
    // in the global scope.
    componentHandler.register({
        constructor: MaterialFullscreenLoading,
        classAsString: 'MaterialFullscreenLoading',
        cssClass: 'mdl-js-fullscreenLoading',
        widget: true
    });
})();
