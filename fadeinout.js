var num = 0;
var imgs = ["url('media/banner.jpg')", "url('media/banner2.jpg')", "url('media/banner3.jpg')", "url('media/banner4.jpg')"];
let img1 = document.getElementById("header-bg-1");
let img2 = document.getElementById("header-bg-2");

function fade() {
    console.log("fade start");

    img1.classList.add("fade-out-image");


    num = (num + 1) % 4;
    img2.style.backgroundImage = imgs[num];
    img2.classList.add("fade-in-image");
    img2.style.display = "block";

    setTimeout(endFade, 5000);
}

function endFade() {
    console.log("fade end");
    img1.style.backgroundImage = imgs[num];
    img1.classList.remove("fade-out-image");

    img2.classList.remove("fade-in-image");
    img2.style.display = "none";

    setTimeout(fade, 5000);
}



window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    endFade();
});