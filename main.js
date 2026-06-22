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

// Group each experience/education entry so it isn't split across PDF pages.
// Chrome's print engine respects "break-inside: avoid" on a wrapper far more
// reliably than "break-after: avoid" on a heading. So we wrap every h3 together
// with the sibling elements that follow it (its lists and paragraphs), up to
// the next h2 or h3, in a div.entry that carries that rule.
function groupEntries() {
  var headings = Array.prototype.slice.call(cvOutput.querySelectorAll('h3'));
  headings.forEach(function (heading) {
    var wrapper = document.createElement('div');
    wrapper.className = 'entry';
    // Insert the wrapper where the heading currently sits.
    heading.parentNode.insertBefore(wrapper, heading);
    // Move the heading and each following sibling into the wrapper until we
    // reach the next section heading (h2 or h3) or run out of siblings.
    var node = heading;
    while (node) {
      var next = node.nextSibling;
      wrapper.appendChild(node);
      if (next && next.nodeType === 1 && (next.tagName === 'H2' || next.tagName === 'H3')) {
        break;
      }
      node = next;
    }
  });
}

groupEntries();

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

// Download button.
// The download control is a <button> rather than a link, so navigation is
// handled here: clicking it opens the PDF named in the button's data-href.
var downloadButton = document.getElementById('download');
if (downloadButton) {
  downloadButton.addEventListener('click', function () {
    window.location.href = downloadButton.getAttribute('data-href');
  });
}

// Bio toggle.
// Switches between the full bio (#bio) and the short bio (#short-bio), both of
// which are rendered inside cvOutput. The full bio shows by default; the button
// label always names the version it will switch to.
var toggleBioButton = cvOutput.querySelector('#toggle-bio');
var fullBio = cvOutput.querySelector('#full-bio');
var shortBio = cvOutput.querySelector('#short-bio');
if (toggleBioButton && fullBio && shortBio) {
  toggleBioButton.addEventListener('click', function () {
    // Read the live computed style, since the short bio starts hidden via CSS
    // (not an inline style), then flip to the opposite state.
    var shortHidden = getComputedStyle(shortBio).display === 'none';
    fullBio.style.display = shortHidden ? 'none' : 'block';
    shortBio.style.display = shortHidden ? 'block' : 'none';
    toggleBioButton.textContent = shortHidden ? 'Show full bio' : 'Show short bio';
  });
}
