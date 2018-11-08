{
  /* <script type="text/javascript">

    // Loading Screen messages

    var LoadTimerId = 0;	// Holds LoadTimer in case it needs to be stopped
    var currentQuote = 0;	// The current index of the loading message

    // All the loading messages
    var LoadQuotes = new Array("Still loading...", "Exaggerating regular expressions...", "Optimizing entertainment algorithms...", "Checking function return policy...", "Relaxing overloaded methods...", "Hello-ing world...", "Auto-saving Private Ryan...", "Updating fun files...", "Fulfilling awesomeness requirements...", "Obfuscating communication specifiers...", "Coloring whitespace...", "Deindividualizing unit tests...", "Entering the matrix...", "Confirming DRADIS communications...", "Installing anti-Skynet firewalls...", "Constructing additional pylons...", "Giving a mouse a cookie...", "Pressing a large red button...", "Adopting an adorable puppy...",  "Initiating launch sequence...", "Opening a mysterious package...", "Spleticulating rines...", "Transmogrifying headers...", "Cajoling the hamsters...", "Accelerating to race conditions...",  "Learning to play the vuvuzela...", "Pressurizing the tubes...", "Fording the river...", "Dreaming of electric sheep...", "Rereading GPL license...", "Achieving sentience...", "Memorizing Pi...", "Ignoring preprocessor directives...", "Paying postage on incoming messages...", "Taking a coffee break...", "Giving it the old college try...", "Generating next message...");

    // Ensures the input is a valid email address, then starts the loading process
    function Submit_Valid(inputbox)
    {
        var address = document.getElementById(inputbox).value;
        if (!(/[a-z0-9\._-]+@[a-z0-9\.-]+\.[a-z\.]+/i.test(document.getElementById(inputbox).value)))
            {
                alert("Please enter a valid email address.");
                document.getElementById(inputbox).focus();
            return false;
            }
        else	// input is valid, return true to submit
            {
            document.getElementById('loadingstatus').style.visibility = 'visible';		// Show loading messages
            document.getElementById(inputbox).value = (document.getElementById(inputbox).value).toLowerCase(); // Convert address because uppercase domains cause errors
            LoadTimerId = setInterval("LoadTimer()", 1000);		// Start LoadTimer, gets called every 2 seconds
            return true;
            }
    }

    // Show a new loading message
    function LoadTimer()
    {
        var randNum = Math.floor(Math.random() * LoadQuotes.length);	// Get a random index for the array of messages

        while (randNum == currentQuote)		// Make sure it's a different message (index)
        {
            randNum = Math.floor(Math.random() * LoadQuotes.length);
        }
        currentQuote = randNum;			// Set to the new index
        document.getElementById('loadingmessage').innerHTML = LoadQuotes[randNum];		// Show the message
    }


</script> */
}
