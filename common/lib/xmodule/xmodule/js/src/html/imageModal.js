$(function() {
  
  // Set up on page load
  $("a.zoomable").each(function() {
    var smallImageObject = $(this).children();
    var largeImageSRC = $(this).attr('href');
    var largeImageALT = smallImageObject.attr('alt');
    
    // if contents of zoomable link is image and large image link exists: setup modal
    if (smallImageObject.is('img') && largeImageSRC) {
      var smallImageHTML = $(this).html();
      var largeImageHTML = '<img alt="' + largeImageALT + ', Large" src="' + largeImageSRC + '" />';
      var tpl = '<div class="image-modal-link"><%= smallImage %><i class="icon-fullscreen icon-3x"></i></div>' +
                '<div class="image-modal"><div class="image-modal-content">' +
                  '<div class="image-modal-imgWrapper"><%= largeImage %></div>' +
                  '<i class="icon-remove icon-3x"></i>' +
                  '<div class="image-modal-zoom"><i class="icon-zoom-in icon-3x"></i><i class="icon-zoom-out icon-3x"></i></div>' +
                '</div></div>';
      $(this).replaceWith(_.template(tpl, {smallImage: smallImageHTML, largeImage: largeImageHTML}));
    }
  });
  var draggie = [];
  $('.image-modal-imgWrapper img').each(function(index) {
    draggie[index] = new Draggabilly( this, {
      containment: true
    });
    draggie[index].disable();
    $(this).attr("id", "draggie-" + index);
  });


  // Opening and closing image modal on clicks
  $(".image-modal-link").click(function() {
    $(this).siblings(".image-modal").addClass('fit-to-screen').show();
    $('html').css({overflow: 'hidden'});
  });
  
  // variable to detect when modal is being "hovered".
  // Done this way as jquery doesn't support the :hover psudo-selector as expected.
  var imageModalImageHover = false;
  $(".image-modal-content img, .image-modal-content .image-modal-zoom").hover(function() {
    imageModalImageHover = true;
  }, function() {
    imageModalImageHover = false;
  });
  
  //Define function to close modal
  function closeModal(imageModal) {
    imageModal.removeClass('zoomed').hide();
    var currentDraggie = $('.image-modal-content .image-modal-imgWrapper img', imageModal).attr('id').split('-');
    draggie[currentDraggie[1]].disable();
    $('html').css({overflow: 'auto'});
  }
  
  // Click outside of modal to close it.
  $(".image-modal").click(function() {
    if (!imageModalImageHover){
      closeModal($(this));
    }
  });
  
  // Click close icon to close modal.
  $(".image-modal-content i.icon-remove").click(function() {
    closeModal($(this).closest(".image-modal"));
  });

  // zooming image in modal and allow it to be dragged
  // Make sure it always starts zero position for below calcs to work
  $(".image-modal-content .image-modal-zoom i").click(function() {
    var mask = $(this).closest(".image-modal-content");
    
    var imageModal = $(this).closest(".image-modal");
    var img = $(this).closest(".image-modal").find("img");
    var currentDraggie = img.attr('id').split('-');
    
    if ($(this).hasClass('icon-zoom-in')) {
      imageModal.removeClass('fit-to-screen').addClass('zoomed');
      
      var imgWidth   = img.width();
      var imgHeight  = img.height();
      
      var imgContainerOffsetLeft = imgWidth - mask.width();
      var imgContainerOffsetTop = imgHeight - mask.height();
      var imgContainerWidth = imgWidth + imgContainerOffsetLeft;
      var imgContainerHeight = imgHeight + imgContainerOffsetTop;
      
      img.parent().css({left: -imgContainerOffsetLeft, top: -imgContainerOffsetTop, width: imgContainerWidth, height: imgContainerHeight});
      img.css({top: imgContainerOffsetTop / 2, left: imgContainerOffsetLeft / 2});
      
      draggie[currentDraggie[1]].enable();
      
    } else if ($(this).hasClass('icon-zoom-out')) {
      imageModal.removeClass('zoomed').addClass('fit-to-screen');
      
      draggie[currentDraggie[1]].disable();
    }
  });
});