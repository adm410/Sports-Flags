document.addEventListener("DOMContentLoaded", getRaceDetails);
document.addEventListener("DOMContentLoaded", getSeasonDetails);
document.addEventListener("DOMContentLoaded", getTrackDetails);
window.onscroll = function () { scrollFunction() };

const urlSeason = "https://api.jolpi.ca/ergast/f1/current.json"
const urlNext = "https://api.jolpi.ca/ergast/f1/current/next.json"
const urlFlag = "https://raw.githubusercontent.com/adm410/Sports-Flags/main/track.json"
const localeType = "en-IN"

let raceDetailsName;
let p1txt;
let p1dt;
let p2txt;
let p2dt;
let p3txt;
let p3dt;
let qualitxt;
let qualidt;
let racetxt;
let racedt;

function copyText() {
    setTimeout(() => {
        document.getElementById("race-details-name").style.display = "none";
        document.getElementById("copyTxt").style.display = "block";
    }, 100);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(`${raceDetailsName}\n\n${p1txt} ${p1dt}\n${p2txt} ${p2dt}\n\n${p3txt} ${p3dt}\n${qualitxt} ${qualidt}\n\n${racetxt} ${racedt}`)
            .catch((error) => {
                console.error(error);
            });
    }
    setTimeout(() => {
        document.getElementById("copyTxt").style.display = "none";
        document.getElementById("race-details-name").style.display = "block";
    }, 3000);
}

function getRaceDetails() {
    fetch(urlNext)
        .then(response => response.json())
        .then(data => {
            locale = localeType
            const options = {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            const race = data.MRData.RaceTable.Races[0];

            const practice1 = race.FirstPractice;
            const p1d = practice1 ? practice1.date : "P1_Date";
            const p1t = practice1 ? practice1.time : "P1_Time";
            const p1Date = new Date(p1d + "T" + p1t);
            p1txt = "Practice 1:"
            p1dt = p1Date.toLocaleString(locale, options);

            const practice2 = race.SecondPractice;
            let p2d = practice2 ? practice2.date : "P2_Date";
            let p2t = practice2 ? practice2.time : "P2_Time";
            const p2Date = new Date(p2d + "T" + p2t);
            p2txt = "Practice 2:"
            p2dt = p2Date.toLocaleString(locale, options);

            const practice3 = race.ThirdPractice;
            let p3d = practice3 ? practice3.date : "P3_Date";
            let p3t = practice3 ? practice3.time : "P3_Time";
            const p3Date = new Date(p3d + "T" + p3t);
            p3txt = "Practice 3:"
            p3dt = p3Date.toLocaleString(locale, options);

            const sprint = race.Sprint;
            let sd = sprint ? sprint.date : "Sprint_Date";
            let st = sprint ? sprint.time : "Sprint_Time";
            const sDate = new Date(sd + "T" + st);

            const quali = race.Qualifying;
            const qd = quali ? quali.date : "Quali_Date";
            const qt = quali ? quali.time : "Quali_Time";
            const qDate = new Date(qd + "T" + qt);
            qualitxt = "Qualifying:"
            qualidt = qDate.toLocaleString(locale, options);

            const rd = race ? race.date : "Race_Date";
            const rt = race ? race.time : "Race_Time";
            const rDate = new Date(rd + "T" + rt);
            racetxt = "Race:"
            racedt = rDate.toLocaleString(locale, options);

            if (p3d === "P3_Date") {
                qualitxt = "Qualifying:"
                qualidt = qDate.toLocaleString(locale, options);

                p2txt = "Sprint Qualifying:"
                p2dt = p2Date.toLocaleString(locale, options);

                p3txt = "Sprint:"
                p3dt = sDate.toLocaleString(locale, options);
            }

            const documentName = `
    Next: ${race.Circuit.Location.locality} ${data.MRData.RaceTable.season}
    `
            raceDetailsName = `${race.raceName}`

            const raceDetailsTrack = `${race.Circuit.circuitName}`
            const raceCountry = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country} `

            const raceRound = `Round ${data.MRData.RaceTable["round"]}`

            const raceDetails = `
    <div style="margin: auto; width: fit-content; text-align: justify;">
    <div>
        <div class="p1txt">${p1txt}</div>
        <div class="p1dt">${p1dt}</div>
    </div>
    <div style="padding-bottom: 20px">
        <div class="p2txt">${p2txt}</div>
        <div class="p2dt pb-4">${p2dt}</div>
    </div>
    <div>
        <div class="p3txt">${p3txt}</div>
        <div class="p3dt">${p3dt}</div>
    </div>
    <div style="padding-bottom: 20px">
        <div class="qualitxt">${qualitxt}</div>
        <div class="qualidt pb-4">${qualidt}</div>
    </div>
    <div>
        <div class="racetxt">${racetxt}</div>
        <div class="racedt">${racedt}</div>
    </div>
    </div>
  `;

            document.getElementById("document-name").innerHTML = documentName;
            document.getElementById("race-details-name").innerHTML = raceDetailsName;
            document.getElementById("race-details-track").innerHTML = raceDetailsTrack;
            document.getElementById("race-details-venue").innerHTML = raceCountry;
            document.getElementById("race-details").innerHTML = raceDetails;
            document.getElementById("race-round").innerHTML = raceRound;
        })
        .catch(error => {
            document.getElementById("race-details-name").innerHTML = `<p class='errorTxt'>Error: ${error}</p>`;
        });
}


function getSeasonDetails() {
    fetch(urlSeason)
        .then(response => response.json())
        .then(data => {

            const seasonRound = `
        of ${data.MRData["total"]}
        `
            document.getElementById("season-round").innerHTML = seasonRound;
        })
}


function getTrackDetails() {
    fetch(urlNext)
        .then(response => response.json())
        .then(data => {
            const race = data.MRData.RaceTable.Races[0];
            const raceTrack = race.Circuit.circuitName;

            fetch(urlFlag)
                .then(response => response.json())
                .then(data => {
                    const track = data.Data.track.find(track => track.name === raceTrack);

                    if (track) {
                        const trackLaps = `
                ${track.laps}
              `
                        const trackLength = `
              ${track.length} Km
              `
                        const trackDistance = `
              ${track.distance} Km
              `
                            ;
                        document.getElementById("track-laps").innerHTML = trackLaps;
                        document.getElementById("track-length").innerHTML = trackLength;
                        document.getElementById("track-distance").innerHTML = trackDistance;
                    } else {
                        document.getElementById("trackData").innerHTML = `<p class='errorTxt'>Error: Track Not Found.</p>`;
                    }
                })
                .catch(error => {
                    document.getElementById("trackData").innerHTML = `<p class='errorTxt'>Error: ${error}</p>`;
                });
        })
        .catch(error => {
            document.getElementById("trackData").innerHTML = `<p class='errorTxt'>Error: ${error}</p>`;
        });
}


function updateDriverTable(year) {
    const driverTable = document.getElementById("driver-table").getElementsByTagName('tbody')[0];
    driverTable.innerHTML = "<tr><td colspan='5'><i class='ti ti-loader-2'></i></td></tr>";

    fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers.json`)
        .then(response => response.json())
        .then(data => {
            const drivers = data.MRData.DriverTable.Drivers;

            while (driverTable.firstChild) {
                driverTable.removeChild(driverTable.firstChild);
            }

            const driverTotal = `
          ${data.MRData.total} Drivers
        `;
            document.getElementById("driver-total").innerHTML = driverTotal;
            document.getElementById("driver-year").innerHTML = year + " Drivers";

            drivers.forEach((driver, index) => {
                const position = index + 1;  // The position can be based on the index in the array
                const driverName = `${driver.givenName} ${driver.familyName}`;
                const nationality = driver.nationality;
                const constructor = "N/A";  // There is no constructor in the new data, so we can set it to "N/A"
                const points = "N/A";  // There are no points in this data either

                const row = driverTable.insertRow();
                const positionCell = row.insertCell(0);
                const driverCell = row.insertCell(1);
                const nationalityCell = row.insertCell(2);
                const constructorCell = row.insertCell(3);
                const pointsCell = row.insertCell(4);

                positionCell.textContent = position;
                driverCell.textContent = driverName;
                nationalityCell.textContent = nationality;
                constructorCell.textContent = constructor;
                pointsCell.textContent = points;
            });
        })
        .catch(error => {
            driverTable.innerHTML = `<tr><td class='errorTxt'>Error: ${error}</td></tr>`;
        });
}

function updateConstructorTable(year) {
    const constructorTable = document.getElementById("constructor-table").getElementsByTagName('tbody')[0];
    constructorTable.innerHTML = "<tr><td colspan='4'><i class='ti ti-loader-2'></i></td></tr>";

    fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructors.json`)
        .then(response => response.json())
        .then(data => {
            const constructors = data.MRData.ConstructorTable.Constructors;

            while (constructorTable.firstChild) {
                constructorTable.removeChild(constructorTable.firstChild);
            }

            const constructorTotal = `${constructors.length} Teams`;
            document.getElementById("constructor-total").innerHTML = constructorTotal;
            document.getElementById("constructor-year").innerHTML = year + " Constructors";

            constructors.forEach((constructor, index) => {
                const position = index + 1;  // Position based on array index
                const constructorName = constructor.name;
                const nationality = constructor.nationality;
                const points = "N/A";  // No points data in this structure, so set to "N/A"

                const row = constructorTable.insertRow();
                const positionCell = row.insertCell(0);
                const constructorCell = row.insertCell(1);
                const nationalityCell = row.insertCell(2);
                const pointsCell = row.insertCell(3);

                positionCell.textContent = position;
                constructorCell.textContent = constructorName;
                nationalityCell.textContent = nationality;
                pointsCell.textContent = points;
            });
        })
        .catch(error => {
            constructorTable.innerHTML = `<tr><td colspan='4' class='errorTxt'>Error: ${error}</td></tr>`;
        });
}


function updateCalendarTable(year) {
    const calendarTable = document.getElementById("calendar-table").getElementsByTagName('tbody')[0];
    calendarTable.innerHTML = "<tr><td colspan='5'><span><i class='ti ti-loader-2'></i></span></td></tr>";

    fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`)
        .then(response => response.json())
        .then(data => {
            locale = localeType
            const options = {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            const options2 = {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour12: true,
            };

            const races = data.MRData.RaceTable.Races;

            while (calendarTable.firstChild) {
                calendarTable.removeChild(calendarTable.firstChild);
            }

            const calendarTotal = `${races.length} Races`;
            document.getElementById("calendar-total").innerHTML = calendarTotal;
            document.getElementById("calendar-year").innerHTML = year + " Race Calendar";

            races.forEach(race => {
                const round = race.round;
                const raceName = race.raceName;
                const circuitName = `${race.Circuit.circuitName}`;
                const country = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`;
                const rd = race ? race.date : "Race_Date";
                let rt;
                let format;
                if (race.time) {
                    rt = race ? race.time : "Race_Time";
                    format = options
                } else {
                    rt = "00:00:00Z";
                    format = options2
                }
                const rDate = new Date(rd + "T" + rt);
                let date = rDate.toLocaleString(locale, format);

                const row = calendarTable.insertRow();
                const roundCell = row.insertCell(0);
                const raceCell = row.insertCell(1);
                const circuitCell = row.insertCell(2);
                const countryCell = row.insertCell(3);
                const dateCell = row.insertCell(4);

                roundCell.textContent = round;
                raceCell.textContent = raceName;
                circuitCell.textContent = circuitName;
                countryCell.textContent = country;
                dateCell.textContent = date;


                fetch(urlNext)
                    .then(response => response.json())
                    .then(data => {
                        const roundNum = `${data.MRData.RaceTable.round}`;

                        if (round === roundNum && new Date().getFullYear() === year) {
                            roundCell.style.backgroundColor = "var(--red)";
                            roundCell.style.color = "var(--white)";
                            roundCell.style.fontWeight = "500";
                            raceCell.style.backgroundColor = "var(--red)";
                            raceCell.style.color = "var(--white)";
                            raceCell.style.fontWeight = "500";
                            circuitCell.style.backgroundColor = "var(--red)";
                            circuitCell.style.color = "var(--white)";
                            circuitCell.style.fontWeight = "500";
                            countryCell.style.backgroundColor = "var(--red)";
                            countryCell.style.color = "var(--white)";
                            countryCell.style.fontWeight = "500";
                            dateCell.style.backgroundColor = "var(--red)";
                            dateCell.style.color = "var(--white)";
                            dateCell.style.fontWeight = "500";
                            if (window.innerWidth > 786) {
                                roundCell.style.borderTopLeftRadius = "11px";
                                roundCell.style.borderBottomLeftRadius = "11px";
                                dateCell.style.borderTopRightRadius = "11px";
                                dateCell.style.borderBottomRightRadius = "11px";
                            } else {
                                roundCell.style.borderTopLeftRadius = "6px";
                                roundCell.style.borderBottomLeftRadius = "6px";
                                dateCell.style.borderTopRightRadius = "6px";
                                dateCell.style.borderBottomRightRadius = "6px";
                            }
                        }
                    });

            });
        })
        .catch(error => {
            calendarTable.innerHTML = `<tr><td colspan='4' class='errorTxt'>Error: ${error}</td></tr>`;
        });
}


document.addEventListener("DOMContentLoaded", function () {
    const yearPicker = document.getElementById('yearPicker');
    const currentYear = new Date().getFullYear();
    yearPicker.value = currentYear;
    yearPicker.max = currentYear;

    updateDriverTable(currentYear);
    updateConstructorTable(currentYear);
    updateCalendarTable(currentYear);

    yearPicker.addEventListener('input', () => {
        const selectedYear = yearPicker.value;
        if (selectedYear && selectedYear.length == 4) {
            updateDriverTable(selectedYear);
            updateConstructorTable(selectedYear);
            updateCalendarTable(selectedYear);
        }
        if (currentYear != selectedYear) {
            document.getElementById("calIcon").style.opacity = "1";
            document.getElementById("calIcon").style.pointerEvents = "all";
        } else {
            document.getElementById("calIcon").style.opacity = "0";
            document.getElementById("calIcon").style.pointerEvents = "none";
        }
    });
});

function updateYear() {
    console.log(window.scrollY);
    window.scrollY = window.scrollY
    const yearPicker = document.getElementById('yearPicker');
    const currentYear = new Date().getFullYear();
    yearPicker.value = currentYear;
    yearPicker.max = currentYear;
    document.getElementById("calIcon").style.opacity = "0";
    document.getElementById("calIcon").style.pointerEvents = "none";

    updateDriverTable(currentYear);
    updateConstructorTable(currentYear);
    updateCalendarTable(currentYear);
}

function enableDarkMode() {
    body.classList.add('dark-mode');
}
function disableDarkMode() {
    body.classList.remove('dark-mode');
}

function scrollFunction() {
    const nextElement = document.getElementById("next").getBoundingClientRect().top;
    const driverElement = document.getElementById("driver").getBoundingClientRect().top;
    const constructorElement = document.getElementById("constructor").getBoundingClientRect().top;
    const calendarElement = document.getElementById("calendar").getBoundingClientRect().top;

    window.addEventListener("scroll", function () {
        const scrollPosition = window.scrollY;
        if (window.innerWidth > 786) {
            if (scrollPosition > 25) {
                document.getElementById("header").style.height = "65px";
                document.getElementById("header").style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
                document.getElementById("headerTxt").style.margin = "10px 15px 0";
                document.getElementById("yearPicker").style.margin = "15px 0px";
                document.getElementById("calIcon").style.margin = "13px 5px";
                document.getElementById("desktopMenu").style.margin = "23px 30px";
            } else {
                document.getElementById("header").style.height = "80px";
                document.getElementById("header").style.boxShadow = "";
                document.getElementById("headerTxt").style.margin = "20px 20px 0";
                document.getElementById("yearPicker").style.margin = "24px 5px";
                document.getElementById("calIcon").style.margin = "22px 5px";
                document.getElementById("desktopMenu").style.margin = "33px 50px";
            }
        } else {
            if (scrollPosition > 25) {
                document.getElementById("header").style.height = "70px";
                document.getElementById("header").style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
                document.getElementById("headerTxt").style.margin = "0";
                document.getElementById("yearPicker").style.margin = "8px 0";
                document.getElementById("calIcon").style.margin = "4px 5px 0";
                document.getElementById("mobileMenu").style.paddingTop = "13px";
            } else {
                document.getElementById("header").style.height = "85px";
                document.getElementById("header").style.boxShadow = "";
                document.getElementById("headerTxt").style.margin = "6px 0";
                document.getElementById("yearPicker").style.margin = "12px 0";
                document.getElementById("calIcon").style.margin = "8px 5px 0";
                document.getElementById("mobileMenu").style.paddingTop = "16px";
            }
        }

        // if (scrollPosition > nextElement) {
        //     document.getElementById("raceBtn").style.color = "var(--textwhite)";
        //     document.getElementById("raceBtn").style.backgroundColor = "var(--red)";
        //     document.getElementById("driverBtn").style.color = "var(--textblack)";
        //     document.getElementById("driverBtn").style.backgroundColor = "transparent";
        //     document.getElementById("constructorBtn").style.color = "var(--textblack)";
        //     document.getElementById("constructorBtn").style.backgroundColor = "transparent";
        //     document.getElementById("calendarBtn").style.color = "var(--textblack)";
        //     document.getElementById("calendarBtn").style.backgroundColor = "transparent";
        // } if (scrollPosition > driverElement) {
        //     document.getElementById("raceBtn").style.color = "var(--textblack)";
        //     document.getElementById("raceBtn").style.backgroundColor = "transparent";
        //     document.getElementById("driverBtn").style.color = "var(--textwhite)";
        //     document.getElementById("driverBtn").style.backgroundColor = "var(--red)";
        //     document.getElementById("constructorBtn").style.color = "var(--textblack)";
        //     document.getElementById("constructorBtn").style.backgroundColor = "transparent";
        //     document.getElementById("calendarBtn").style.color = "var(--textblack)";
        //     document.getElementById("calendarBtn").style.backgroundColor = "transparent";
        // } if (scrollPosition > constructorElement) {
        //     document.getElementById("raceBtn").style.color = "var(--textblack)";
        //     document.getElementById("raceBtn").style.backgroundColor = "transparent";
        //     document.getElementById("driverBtn").style.color = "var(--textblack)";
        //     document.getElementById("driverBtn").style.backgroundColor = "transparent";
        //     document.getElementById("constructorBtn").style.color = "var(--textwhite)";
        //     document.getElementById("constructorBtn").style.backgroundColor = "var(--red)";
        //     document.getElementById("calendarBtn").style.color = "var(--textblack)";
        //     document.getElementById("calendarBtn").style.backgroundColor = "transparent";
        // } if (scrollPosition > calendarElement) {
        //     document.getElementById("raceBtn").style.color = "var(--textblack)";
        //     document.getElementById("raceBtn").style.backgroundColor = "transparent";
        //     document.getElementById("driverBtn").style.color = "var(--textblack)";
        //     document.getElementById("driverBtn").style.backgroundColor = "transparent";
        //     document.getElementById("constructorBtn").style.color = "var(--textblack)";
        //     document.getElementById("constructorBtn").style.backgroundColor = "transparent";
        //     document.getElementById("calendarBtn").style.color = "var(--textwhite)";
        //     document.getElementById("calendarBtn").style.backgroundColor = "var(--red)";
        // }
    });
}