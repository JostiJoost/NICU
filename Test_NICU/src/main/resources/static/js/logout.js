/**
 * Script wat de logout van de applicatie verzorgd
 * @author Anne Beumer
 * @version 1.0, 22-05-2025
 * @since 22-05-2025
 * */
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