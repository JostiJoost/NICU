document.addEventListener("DOMContentLoaded", () => {

    const profielIcoon = document.getElementById("profielIcoon");
    const logoutMenu = document.getElementById("logoutMenu");
    if(profielIcoon && logoutMenu){
        profielIcoon.addEventListener("click", function (event){
            event.stopPropagation();
            logoutMenu.classList.toggle("show");
        });

        document.addEventListener("click", function(event){
            if(!event.target.closest(".profile-container") && !event.target.closest("#logoutMenu")){
                logoutMenu.classList.remove("show");
            }
        });
    }

});