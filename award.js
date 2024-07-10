window.onload = (event) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mission = urlParams.get('mission');
    const name = urlParams.get('name');
    const kid = urlParams.get('kid');
    document.getElementById("name-text").innerText = name;
    document.getElementById("kid-name").innerText = kid;
    document.getElementById("character").src = skins[mission].hero;

    document.getElementById("mission-text").innerHTML = skins[mission].award[0];
    document.getElementById("signature").innerHTML = skins[mission].award[1];
};
