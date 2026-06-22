// Options for marked.js
marked.setOptions({
  renderer: new marked.Renderer(),
  smartLists: true,
  smartypants: true
});

// Process markdown
var cvInput = document.getElementById('cvInput');
var cvOutput = document.getElementById('cvOutput');
cvOutput.innerHTML = marked.parse(cvInput.innerHTML);
cvInput.style.display = 'none';

// Auto-calculate durations for ongoing roles.
// Any element marked up as <span class="years" data-start="YYYY-MM">…</span>
// has its text replaced with the whole number of years from that start date
// to today, so the figure never goes stale. Marking up the figures directly
// avoids any reliance on matching specific wording.
function updateDurations() {
  var now = new Date();
  var spans = cvOutput.querySelectorAll('.years[data-start]');
  spans.forEach(function (span) {
    var parts = span.getAttribute('data-start').split('-');
    var startYear = parseInt(parts[0], 10);
    var startMonth = parseInt(parts[1], 10) - 1; // Months are 0-indexed
    if (isNaN(startYear) || isNaN(startMonth)) return; // Bad data: leave as-is
    // Whole years elapsed between the start date and now
    var years = now.getFullYear() - startYear;
    if (now.getMonth() < startMonth) years -= 1;
    span.textContent = years + ' ' + (years === 1 ? 'year' : 'years');
  });
}

updateDurations();
