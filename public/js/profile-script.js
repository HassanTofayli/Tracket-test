const profile = document.getElementById("profile");
const profilePopup = document.getElementById("profilePopup");
profile.addEventListener("click", () => {
  profilePopup.classList.toggle("hidden");
});

$(document).ready(function () {
  // Call REST Countries API to get list of countries
  $.get("https://restcountries.com/v3.1/all", function (countries) {
    // Loop through each country and add an option to the select tag
    $.each(countries, function (index, country) {
      $("#country").append(
        $("<option>", {
          value: country.name.common,
          text: country.name.common,
        })
      );
    });
  });
});
