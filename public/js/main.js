$(document).ready(() => {
  $("#category-delete").on("click", (e) => {
    $target = $(e.target);
    $.ajax({
      type: "DELETE",
      url: "/categories/delete/" + $target.attr("cat-id-data"),
      success: (response)=>  {
       console.log(response)
       alert("deleted")
      },
      error: (error) => {
        console.log(error);
      }
    });
  });
  $("#article-delete").on("click",(e) => {
    
    $target = $(e.target);
    $.ajax({
      type: "DELETE",
      url: "/articles/delete/" + $target.attr("art-id-data"),
      success: (response) =>  {
       alert("Deleted")
      
      },
      error: (error) => {
        console.log(error);
      }
    });
  });
});


$(".dropdown-trigger").dropdown();
$(document).ready(function(){
  $('.carousel').carousel({
  
  });
});

   


