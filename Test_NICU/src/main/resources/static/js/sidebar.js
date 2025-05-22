document.addEventListener('DOMContentLoaded', function (){
var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if(!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if(sidebarOpen) {
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen = false;
    }
}

(async function() {
    const menuElement = document.getElementById('sidebarMenu');
    if (!menuElement) return;

    try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Niet ingelogd');

        const user = await response.json();
        const role = user.role;

        let html =
            `<li class="sidebar-list-item">
                <span class="material-icons-outlined">dashboard</span> Dashboard
            </li> 
            <ul class="sidebar-sublist"> 
                <li><span class="material-icons-outlined" >fiber_manual_record</span><a href="dashboard.html">Per Studie</a></li>
                <li><span class="material-icons-outlined" >fiber_manual_record</span><a href="dashboard2.html">Per Centrum</a></li>
            </ul>`;

        if (role === 'ROLE_ADMIN') {
            html += `
                <li class="sidebar-list-item">
                    <span class="material-icons-outlined">fact_check</span> <a href="/invulPagStudie.html">Studie invoer</a>
                </li>
                <li class="sidebar-list-item">
                    <span class="material-icons-outlined">inventory_2</span> <a href="/protocol.html">Protocol invoer</a>
                </li>
                <li class="sidebar-list-item">
                    <span class="material-icons-outlined">add</span> <a href="/admin.html">Nieuwe studie</a>
                </li>
                <li class="sidebar-list-item">
                    <span class="material-icons-outlined">lock_reset</span><a href="/wachtwoordbeheer.html">Wachtwoordbeheer</a>
                
                </li>`;
        } else if (role === 'ROLE_STUDIE') {
            html += `
                <li class="sidebar-list-item">
                    <span class="material-icons-outlined">fact_check</span> <a href="/invulPagStudie.html">Studie beheer</a>
                </li>`;
        } else if (role === 'ROLE_PROTOCOLMAKER') {
            html += `
                <li class="sidebar-list-item">
                    <span class="material-icons-outlined">inventory_2</span> <a href="/protocol.html">Protocolbeheer</a>
                </li>`;
        }
        menuElement.innerHTML = html;

    } catch (err) {
        console.error('Gebruikersinfo kon niet worden opgehaald: ', err);
        menuElement.innerHTML = `
            <li class="sidebar-list-item">
                <a href="login.html">Inloggen</a>
            </li>`;
    }
})();

const profielIcoon = document.getElementById('profielIcoon');
const dropdown = document.getElementById('logoutMenu');

profielIcoon.addEventListener('click', function (event){
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
});

document.addEventListener('click', function(event){
    if(!dropdown.contains(event.target) ){dropdown.style.display = 'none';}
});
});