const vehicles = document.getElementById("vehicles");
const vehiclesPopup = document.getElementById("vehiclesPopup");
vehicles.addEventListener("click", () => {
  vehiclesPopup.classList.toggle("hidden");
});
const profile = document.getElementById("profile");
const profilePopup = document.getElementById("profilePopup");
profile.addEventListener("click", () => {
  profilePopup.classList.toggle("hidden");
});

// document.addEventListener("click", (event) => {
//     if (!vehiclesPopup.contains(event.target)) {
//         vehiclesPopup.classList.add("hidden")
//     } else {
//         vehiclesPopup.classList.toggle("hidden");

//     }
//     // if (!profilePopup.contains(event.target)) {
//     //   profilePopup.classList.add("hidden");
//     // }

// })
