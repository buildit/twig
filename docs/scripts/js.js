// When the user clicks on (x), close the modal
function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

window.onload = function () {
    var acc = document.getElementsByClassName("accordion");
    var panel = document.getElementsByClassName('panel');
    
    for (var i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            var setClasses = !this.classList.contains('active');
            setClass(acc, 'active', 'remove');
            setClass(panel, 'show', 'remove');
            
               if (setClasses) {
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("show");
            }
        }
    }
    
    function setClass(els, className, fnName) {
        for (var i = 0; i < els.length; i++) {
            els[i].classList[fnName](className);
        }
    }
    
    //modal
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

}


$(document).ready(function () {
    //responsive header/nav
    if ($(window).width() < 700) {
        //toggle main nav
        $("#hamburger").click(function () {

            //  $("#navlist").toggleClass("show");
            $("#navlist").toggle();
        });
    } else {
        $("#navlist").show();
    }


    //nav active class
    $('.nav-link').on('click', function (e) {
        e.preventDefault();
        $('.active').removeClass('active');
        $(this).addClass('active');
    });

    //prevent hashtag default
    // $('a[href^=#]').click(function (e) { e.preventDefault(); });
    $('p.code').click(copyThis);


    //slidebar
    $(".range-slider-value").on('input', function () {
        var value = $(this).val();
        $(".range-slider-range").val(value);
    });

    $(".range-slider-range").on('input', function () {
        var value = $(this).val();
        console.log(value);
        $(".range-slider-value").val(value);
    });


});

//copy
function copyThis() {

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).text()).select();
    document.execCommand("copy");
    $temp.remove();
}