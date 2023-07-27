const ws = new WebSocket("wss://obsidian-syncify-main.saturnwillow.repl.co/echo");

function send(data) {
	ws.send(JSON.stringify(data));
}

ws.addEventListener("open", () => {
    console.log("We are connected");   
});

ws.addEventListener("message", msg => {
    msg = JSON.parse(msg);
});

function handleFormSubmitLog(event) {
    // Get the form data using FormData API
    const form = event.target;
    const formData = new FormData(form);

    // Convert the FormData object to a regular object
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    // Convert the object to JSON
    const jsonData = JSON.stringify(formDataObj);


    console.log(`Logging in with: ${jsonData}`);
    
 }
 function handleFormSubmitSign(event) {
    // Get the form data using FormData API
    const form = event.target;
    const formData = new FormData(form);

    // Convert the FormData object to a regular object
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    // Convert the object to JSON
    const jsonData = JSON.stringify(formDataObj);


    console.log(`Signing up with: ${jsonData}`);
    
 }

 const logForm = document.getElementById('login');
 const signForm = document.getElementById('createAccount');

 // Add the event listener to the forms container for form submissions
 logForm.addEventListener('submit', handleFormSubmitLog);
 signForm.addEventListener('submit', handleFormSubmitSign);