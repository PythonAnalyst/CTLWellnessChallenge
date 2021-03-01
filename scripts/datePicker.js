const Calender = document.querySelector('.datepicker');

const todayRaw = new Date();
Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function short_months(dt)
   { 
     return Date.shortMonths[dt]; 
   }

let todayString = `${short_months(todayRaw.getMonth())} 
                   ${('0' + todayRaw.getDay()).slice(-2)}, 
                   ${todayRaw.getFullYear()}`; // this is so the selected date from date picker
                                               // matches up with the date made with new Date to 
                                               // compare dates

// Calander Materialize 
 // Date Picker stuff
 M.Datepicker.init(Calender, {
  showClearBtn:true,
  defaultDate: new Date(),
  setDefaultDate:true
});


// getting date that is in the selector
var selectedDate = new Date(document.getElementById("dateSelected").value);
document.getElementById("dateSelected").addEventListener("change", myFunction);
function myFunction() {
   selectedDate = new Date(document.getElementById("dateSelected").value).toDateString();
};        