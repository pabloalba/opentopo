var state = {
    screen: 'main',
    trip: 0,
    place: 0
}

const domPlaces = document.getElementById("places");
const domPlacesDone = document.getElementById("places-done");

const domQuestionTitle = document.getElementById("question-title");
const domQuestionText = document.getElementById("question-text");
const domQuestionAnswers = document.getElementById("question-answers");


const domDialog = document.getElementById("dialog");
const domDialogTitle = document.getElementById("dialog-title");
const domDialogContent = document.getElementById("dialog-content");
const domDialogBody = document.getElementById("dialog-body");


const screens = new Map();
var trips;
var currentTripInfo;
var currentMission;
var currentSkin;
var answers;
var currentQuestion;
var showingIntro;
var selectedAnswer;
var currentPlaceInfo;
var numAnswers;
var currentKidName;

function render(state) {
    if (state.screen == 'main') {
        renderMain();
    }
    if (state.screen == 'trip') {
        renderTrip();
    }
    if (state.screen == 'question') {
        renderQuestion();
    }
}

function showScreen(screen) {
    for (const s of screens.values()) {
        s.style.display = 'none';
    }
    screens.get(screen).style.display = 'block';
}


function createTrip(trip) {
    var img = document.createElement("img");
    img.src = trip.image;
    var name = document.createElement("div");
    name.innerText = trip.name;
    name.classList.add("trip-name");

    var div = document.createElement("div");
    div.appendChild(img);
    div.appendChild(name);
    div.classList.add("trip-item");

    div.addEventListener("click", (e) => { openTrip(trip.id) });
    return div;
}

async function loadTrips() {
    trips = await listTrips();
    tripsList = document.getElementById("trips-list");
    for (const trip of trips) {
        tripsList.appendChild(createTrip(trip));
    }
}

function renderMain() {
    showScreen('main');
    document.body.className = '';
    document.body.classList.add("main");

    if (trips == null) {
        loadTrips();
    }
}

function createPlaceDom(place, placeDone) {
    var number = document.createElement("div");
    number.innerText = place.id + 1;
    number.classList.add("number");

    var img = document.createElement("img");
    img.src = place.image;
    img.classList.add("image");

    var name = document.createElement("div");
    name.innerText = place.name;
    name.classList.add("name");

    var marker = document.createElement("img");
    marker.src = "media/marker.png";
    marker.classList.add("marker");

    if (placeDone) {
        marker.src = currentSkin.rewards[place.id].image;
        marker.classList.add("done");
        marker.classList.add(currentMission);
    }

    var container = document.createElement("div");
    container.classList.add("place");

    container.appendChild(number);
    container.appendChild(img);
    container.appendChild(name);
    container.appendChild(marker);

    return container;
}

function createPlace(place, placeDone) {
    container = createPlaceDom(place, placeDone);

    if (placeDone) {
        container.classList.add("done");
        if ((domPlacesDone.children.length % 2) != 0) {
            container.classList.add("even");
        }
        domPlacesDone.appendChild(container);
    } else {
        if ((domPlaces.children.length % 2) != 0) {
            container.classList.add("even");
        }
        container.addEventListener("click", (e) => { openQuestion(place.id) });
        domPlaces.appendChild(container);
    }
}

function renderTrip() {
    showScreen('trip');
    closeTripMenu();
    document.body.className = '';
    document.body.classList.add("trip");
    const domTitle = document.getElementById("trip-screen-title");
    const domTitleImg = document.getElementById("trip-screen-title-img");
    const domTitleText = document.getElementById("trip-screen-title-text");
    const domTitleMenu = document.getElementById("trip-screen-title-menu");


    domTitleText.innerHTML = trips[state.trip].name;
    domTitleImg.src = trips[state.trip].image;

    currentTripInfo = JSON.parse(localStorage.getItem("tripInfo" + state.trip));
    currentMission = currentTripInfo.mission
    currentSkin = skins[currentMission];

    domPlaces.innerHTML = '';
    domPlacesDone.innerHTML = '';

    for (var i = 0; i < 12; i++) {
        createPlace(trips[state.trip].places[i], currentTripInfo.answers[i]);
    }

    document.getElementById('show-award').style.display = "none";
    if (currentTripInfo.answers.filter(Boolean).length == 12) {
        document.getElementById('show-award').style.display = "block";
    }

}

function createIntro(intro) {
    for (var i = 0; i < intro.text.length; i++) {
        var p = document.createElement("p");
        p.innerText = intro.text[i];
        domQuestionText.appendChild(p);
    }

    var img = document.createElement("img");
    img.src = intro.image;
    img.classList.add("image");
    domQuestionText.appendChild(img);
}

function selectAnswer(answer) {
    document.getElementById('answer0').classList.remove("selected");
    document.getElementById('answer1').classList.remove("selected");
    document.getElementById('answer2').classList.remove("selected");
    document.getElementById('answer3').classList.remove("selected");

    document.getElementById('answer' + answer).classList.add("selected");
    selectedAnswer = answer;
}

function createQuestion(question, answers) {
    for (var i = 0; i < question.length; i++) {
        var p = document.createElement("p");
        p.innerText = question[i];
        domQuestionText.appendChild(p);
    }

    for (var i = 0; i < 4; i++) {
        var container = document.createElement("div");
        container.classList.add("answer-container");

        if (answers[i].image) {
            var img = document.createElement("img");
            img.src = answers[i].image;
            container.appendChild(img);
        }

        if (answers[i].text) {
            var text = document.createElement("div");
            text.innerHTML = answers[i].text;
            container.appendChild(text);
        }

        container.id = "answer" + i;
        container.dataset.answer = i;
        container.addEventListener("click", (e) => { selectAnswer(e.currentTarget.dataset.answer) });
        domQuestionAnswers.appendChild(container);
    }
}

function renderQuestion() {
    showScreen('question');
    document.body.className = '';
    document.body.classList.add("question");

    domQuestionTitle.innerHTML = '';
    domQuestionText.innerHTML = '';
    domQuestionAnswers.innerHTML = '';
    currentPlaceInfo = trips[state.trip].places[state.place];
    const place = createPlaceDom(currentPlaceInfo);
    domQuestionTitle.appendChild(place);

    var questionNumbers = document.getElementById("question-numbers");
    questionNumbers.innerHTML = '';
    for (var i = 0; i < currentPlaceInfo.questions.length; i++) {
        var number = document.createElement("div");
        number.innerText = (i + 1);
        if (currentQuestion == i) {
            number.classList.add("selected");
        }
        questionNumbers.appendChild(number);
    }

    if (showingIntro) {
        createIntro(currentPlaceInfo.questions[currentQuestion].intro);
    } else {
        createQuestion(currentPlaceInfo.questions[currentQuestion].question, currentPlaceInfo.questions[currentQuestion].answers);
    }
}

function questionGoBack() {
    if (showingIntro) {
        navigate("trip");
    } else {
        showingIntro = true;
        renderQuestion();
    }
}


function createQuestionPreview() {
    var answer = document.getElementById('answer' + selectedAnswer).cloneNode(true);
    var container = document.createElement("div");
    container.classList.add("question-dialog-confirm");
    container.appendChild(answer);

    return container;
}


function showQuestionFailure() {
    openDialog(
        "Error",
        createTextQuestion("¡No! ¡Esa respuesta es incorrecta! Intentalo de nuevo..."),
        {
            text: "OK",
            callBack: closeDialog
        },
        null,
        "failure"
    );
}

function createReward() {

    var text = document.createElement("div");
    text.innerText = currentSkin.rewards[currentPlaceInfo.id].text;

    var img = document.createElement("img");
    img.src = currentSkin.rewards[currentPlaceInfo.id].image;
    img.classList.add("character")
    img.classList.add(currentMission);

    var imgStar = document.createElement("img");
    imgStar.src = "media/star.png";
    imgStar.classList.add("star")


    var container = document.createElement("div");
    container.appendChild(text);
    container.appendChild(imgStar);
    container.appendChild(img);
    container.classList.add("reward")

    return container;
}

function showReward() {
    openDialog(
        "",
        createReward(),
        {
            text: "OK",
            callBack: () => {
                closeDialog();
                currentTripInfo.answers[state.place] = true;
                saveTripInfo();
                numRewards = currentTripInfo.answers.filter(Boolean).length;

                if (numRewards == 3) {
                    showCup(0);
                } else if (numRewards == 6) {
                    showCup(1);
                } else if (numRewards == 9) {
                    showCup(2);
                } else if (numRewards == 12) {
                    showCup(3);
                } else {
                    navigate("trip");
                }
            }
        },
        null,
        "success"
    );
}

function openAward() {
    window.open("award.html?mission=" + currentMission + "&name=" + trips[state.trip].name + "&kid=" + currentTripInfo.kidName, "_blank");
}

function downloadMap() {
    window.open(trips[state.trip].map, "_blank");
}

function createCup(cupNumber) {

    var text = document.createElement("div");
    if (cupNumber == 0) {
        text.innerText = "¡Has conseguido la copa de bronce! Ya puedes pegar su pegatina.";
    } else if (cupNumber == 1) {
        text.innerText = "¡Has conseguido la copa de plata! Ya puedes pegar su pegatina.";
    } else if (cupNumber == 2) {
        text.innerText = "¡Has conseguido la copa de oro! Ya puedes pegar su pegatina.";
    } else {
        text.innerText = "¡Enhorabuena! ¡Misión cumplida! Pincha aquí para obtener tu diploma. Además puedes pegar su pegatina";
    }

    var img = document.createElement("img");


    if (cupNumber == 0) {
        img.src = "media/bronze-cup.png";
    } else if (cupNumber == 1) {
        img.src = "media/silver-cup.png";
    } else if (cupNumber == 2) {
        img.src = "media/gold-cup.png";
    } else {
        img.src = "media/award.png";
    }

    var imgStar;

    if (cupNumber < 3) {
        img.classList.add("cup")

        imgStar = document.createElement("img");
        imgStar.src = "media/star.png";
        imgStar.classList.add("star")
    } else {
        img.classList.add("award")
        img.addEventListener("click", (e) => {
            openAward();
        });
    }


    var container = document.createElement("div");
    container.appendChild(text);
    if (cupNumber < 3) {
        container.appendChild(imgStar);
    }
    container.appendChild(img);
    container.classList.add("reward")

    return container;
}

function showCup(cupNumber) {
    openDialog(
        "",
        createCup(cupNumber),
        {
            text: "OK",
            callBack: () => {
                closeDialog();
                if (cupNumber == 3) {
                    navigate("main");
                } else {
                    navigate("trip");
                }
            }
        },
        null,
        "success"
    );
}

function showQuestionSuccess() {
    openDialog(
        "¡Correcto!",
        createTextQuestion("¡Si! ¡Has acertado!"),
        {
            text: "OK",
            callBack: () => {
                closeDialog();
                if (currentQuestion == currentPlaceInfo.questions.length - 1) {
                    showReward();
                } else {
                    currentQuestion += 1;
                    showingIntro = true;
                    navigate("question");
                }
            }
        },
        null,
        "success"
    );
}

function questionNext() {
    if (showingIntro) {
        showingIntro = false;
        renderQuestion();
    } else {
        openDialog(
            "¿Estas seguro?",
            createQuestionPreview(),
            {
                text: "◀  NO",
                callBack: closeDialog
            },
            {
                text: "SI  ▶",
                callBack: () => {
                    closeDialog();
                    var correct = currentPlaceInfo.questions[currentQuestion].answers[selectedAnswer].correct;
                    if (correct) {
                        showQuestionSuccess();
                    } else {
                        showQuestionFailure();
                    }

                }
            }
        );
    }
}

function closeConfirm() {
    domQuestionDialog.style.display = "none";
}

function confirmYes() {
    domQuestionDialogConfirm.style.display = "none";
    if (trips[state.trip].places[state.place].questions[currentQuestion].answers[selectedAnswer].correct) {
        domQuestionDialogSuccess.style.display = "flex";
    } else {
        domQuestionDialogFailure.style.display = "flex";
    }

}

function openQuestion(id) {
    state.place = id;
    currentQuestion = 0;
    showingIntro = true;
    navigate("question");
}

function createMissionSelector(mission) {


}


function createMissions() {
    var title = document.createElement("div");
    title.classList.add("mission-title");
    title.innerText = "ELIGE TU MISIÓN"


    var selector = document.createElement("div");
    selector.classList.add("mission-select");
    for (const skin in skins) {
        var img = document.createElement("img");
        img.src = skins[skin].hero;
        img.addEventListener("click", (e) => { selectMission(skin) });
        img.classList.add("mission-select-" + skin);
        if (currentMission == skin) {
            img.classList.add("selected");
        }
        selector.appendChild(img);
    }


    var missionImage = document.createElement("img");
    missionImage.classList.add("mission-image");

    var missionText = document.createElement("div");
    missionText.classList.add("mission-text");

    var missionBody = document.createElement("div");
    missionBody.classList.add("mission-body");
    missionBody.appendChild(missionImage);
    missionBody.appendChild(missionText);



    var container = document.createElement("div");
    container.id = "opened-missions";
    container.appendChild(title);
    container.appendChild(selector);
    container.appendChild(missionBody);

    return container;
}

function selectMission(mission) {
    currentMission = mission;
    var missionSelectors = document.querySelectorAll(".mission-select img");
    for (let i = 0; i < missionSelectors.length; i++) {
        missionSelectors[i].classList.remove("selected");
    }
    document.querySelector(".mission-select-" + mission).classList.add("selected");
    document.querySelector(".mission-image").src = skins[mission].hero;

    const text = document.querySelector(".mission-text");
    text.innerHTML = "";
    for (let i = 0; i < skins[mission].text.length; i++) {
        var p = document.createElement("p");
        p.innerText = skins[mission].text[i];
        text.appendChild(p);
    }
}

function showKidName() {
    var missions = document.getElementById("opened-missions");
    missions.querySelector('.mission-title').innerText = "¡GENIAL! ¿Cómo te llamas?";
    missions.querySelector('.mission-select').style.display = "none";


    const missionBody = document.querySelector(".mission-body");
    missionBody.classList.add("kid-name");

    const text = document.querySelector(".mission-text");
    text.innerHTML = "";

    var inputName = document.createElement("input");
    inputName.id = "kid-name";
    inputName.type = "text";
    inputName.addEventListener("change", (e) => { setKidName() });

    var p = document.createElement("p");
    p.appendChild(inputName);
    text.appendChild(p);

}

function setKidName() {
    currentKidName = document.getElementById("kid-name").value;
    console.log("currentKidName " + currentKidName);
}


function openTrip(id) {

    console.log("open trip " + id);
    currentTripInfo = JSON.parse(localStorage.getItem("tripInfo" + id));
    if (currentTripInfo) {
		console.log("exist currentTripInfo");
		console.log(currentTripInfo);
        state.trip = id;
        navigate("trip");
    } else {
		console.log("not exist currentTripInfo");
        currentKidName = null;
        currentMission = null;
        openDialog(
            trips[id].name,
            createMissions(),
            {
                text: "◀  VOLVER",
                callBack: closeDialog
            },
            {
                text: "¡VAMOS!  ▶",
                callBack: () => {
                    if (currentKidName == null) {
                        showKidName();
                    } else {
                        state.trip = id;
                        currentTripInfo = {
                            mission: currentMission,
                            kidName: currentKidName,
                            answers: [false, false, false, false, false, false, false, false, false, false, false, false]

                        }
                        saveTripInfo();
                        navigate("trip");
                        closeDialog();
                    }
                }
            }
        );        
        selectMission(Object.keys(skins)[0]);
    }
}


function closeDialog() {
    domDialogContent.innerHTML = '';
    domDialog.style.display = "none";
}

function openDialog(title, content, b1, b2) {
    openDialog(title, content, b1, b2, null);
}

function openDialog(title, content, b1, b2, className) {
    domDialog.className = '';
    domDialog.classList.add("dialog");
    if (className) {
        domDialog.classList.add(className);
    }


    domDialogTitle.innerText = title;
    domDialogContent.innerHTML = '';

    domDialogContent.appendChild(content);

    var domDialogButton1 = document.getElementById("dialog-button1");
    var domDialogButton2 = document.getElementById("dialog-button2");

    domDialogButton1.replaceWith(domDialogButton1.cloneNode(true));
    domDialogButton2.replaceWith(domDialogButton2.cloneNode(true));

    domDialogButton1 = document.getElementById("dialog-button1");
    domDialogButton2 = document.getElementById("dialog-button2");


    domDialogButton1.innerText = b1.text;
    domDialogButton1.addEventListener("click", b1.callBack);

    if (b2) {
        domDialogButton2.innerText = b2.text;
        domDialogButton2.addEventListener("click", b2.callBack);
        domDialogButton2.style.display = "block";
    } else {
        domDialogButton2.style.display = "none";
    }

    domDialog.style.display = "block";
}

function toggleTripMenu() {
    var tripMenu = document.getElementById("trip-screen-menu");
    if (tripMenu.style.display == "block") {
        tripMenu.style.display = "none";
    } else {
        tripMenu.style.display = "block";
    }
}

function closeTripMenu() {
    document.getElementById("trip-screen-menu").style.display = "none";
}

function deleteTrip() {
    closeTripMenu();

    openDialog(
        "¿Estas seguro?",
        createTextQuestion("Si eliminas esta aventura, perderás todo tu progreso"),
        {
            text: "NO",
            callBack: closeDialog
        },
        {
            text: "SI",
            callBack: () => {
                currentTripInfo = null;
                saveTripInfo();
                closeDialog();
                goBackToMain();
            }
        }
    );
}

function goBackToMain() {
    navigate("main");
}


function createTextQuestion(question) {
    var img = document.createElement("img");
    img.src = currentSkin.hero;
    img.classList.add("text-question-img");

    var bocadillo = document.createElement("div");
    bocadillo.classList.add("bocadillo-redondo");

    var text = document.createElement("div");
    text.innerText = question;
    text.classList.add("bocadillo-redondo-inside");
    bocadillo.appendChild(text);

    var container = document.createElement("div");
    container.classList.add("text-question");
    container.appendChild(img);
    container.appendChild(bocadillo);
    return container;
}

function initialize() {
    screens.set("main", document.getElementById('main-screen'));
    screens.set("trip", document.getElementById('trip-screen'));
    screens.set("question", document.getElementById('question-screen'));
    window.history.replaceState(state, null, "");
    render(state);
}

function saveTripInfo() {
    localStorage.setItem("tripInfo" + state.trip, JSON.stringify(currentTripInfo));
}

function navigate(screen) {
    state.screen = screen;
    window.history.pushState(state, null, "");
    render(state);
}

window.onload = (event) => {
    initialize();
};

window.onpopstate = function (event) {
    if (event.state) {
        state = event.state;
    } render(state);
};
