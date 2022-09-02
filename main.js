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
