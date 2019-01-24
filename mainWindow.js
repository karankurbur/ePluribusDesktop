const port = 3000
var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use(cors())


app.get('/', (req, res) => {
    // res.send('Hello World!');
    // console.log('in get')    
    // document.getElementById('counter').innerHTML = 'Hello World!';

})

app.post('/displayCredentials', (req, res) => {
    var attestations = req.body.attestations;
    var dids = req.body.verifierdid;

    var table = document.getElementById("table");
    for (var i = 0; i < attestations.length; i++) {
        var row = table.insertRow(i + 1);
        var allow = 'allow' + i;
        var x = document.createElement("INPUT");
        x.setAttribute("type", "checkbox");
        x.setAttribute("id", allow);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.append(x);
        // cell2.innerHTML = response[0].attestation;
        // cell3.innerHTML = response[0].verifierdid;
        cell2.innerHTML = attestations[i];
        cell3.innerHTML = dids[i];
    }
    res.send(true);
})


function storeCredentialsToFile(credentials) {
    fs.writeFile('sampleCreds.txt', 'og god nooooooooooooo', (err) => {
        if (err) throw err;

    })
}

function lock() {
    var algorithm = 'aes256';
    var inputEncoding = 'utf8';
    var outputEncoding = 'hex';

    var key = 'ciw7p02f70000ysjon7gztjn7';
    var text = '72721827b4b4ee493ac09c635827c15ce014c3c3';

    console.log('Ciphering "%s" with key "%s" using %s', text, key, algorithm);

    var cipher = crypto.createCipher(algorithm, key);
    var ciphered = cipher.update(text, inputEncoding, outputEncoding);
    ciphered += cipher.final(outputEncoding);

    console.log('Result in %s is "%s"', outputEncoding, ciphered);

    var decipher = crypto.createDecipher(algorithm, key);
    var deciphered = decipher.update(ciphered, outputEncoding, inputEncoding);
    deciphered += decipher.final(inputEncoding);
    console.log(deciphered);

}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var prompts = [];
var answers = [];
var resp = {};

window.onload = async function () {
    document.getElementById("answers").style.display = "none";

    document.getElementById("submit").onclick = async function () {

        var json = {
            "user": "ws@epluribus.io",
            "pass": "dfghrkj58034y5uvg",
            "service": "IDMatchPLUS5.0.MULTI",
            "target": {
                "fn": document.getElementById("fn").value,
                "ln": document.getElementById("ln").value,
                "addr": document.getElementById("addr").value,
                "city": document.getElementById("city").value,
                "state": document.getElementById("state").value,
                "zip": document.getElementById("zip").value,
                "dob": document.getElementById("dob").value,
            }
        };
        const rawResponse = await fetch('https://production.idresponse.com/process/multi/gateway', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });
        const content = await rawResponse.json();
        resp = content;
        var response = content.output.questions.questions
        console.log(content);
        var answers = document.getElementById('answers');


        for (var i = 0; i < response.length; i++) {
            var br = document.createElement("br");

            var questionForm = document.createElement("form");
            var questionPrompt = document.createElement("span");
            questionPrompt.innerHTML = response[i].prompt;
            questionForm.appendChild(questionPrompt);
            questionForm.append(document.createElement("br"));

            var question = response[i].id;
            prompts.push(question);
            for (var questionNumber = 0; questionNumber < response[i].answers.length; questionNumber++) {
                var question = document.createElement("span");
                question.innerHTML = response[i].answers[questionNumber].text;
                var q = document.createElement("input");
                var qID = 'q' + (i + 1);
                q.setAttribute("type", "radio");
                q.name = prompts[i];
                q.value = response[i].answers[questionNumber].text;
                questionForm.appendChild(q);
                questionForm.appendChild(question);
                questionForm.append(document.createElement("br"));
            }
            answers.appendChild(br);
            answers.appendChild(questionForm);
        }
        document.getElementById("answers").style.display = "block";
    };

    document.getElementById("submitAnswers").onclick = async function () {

        //console.log(resp.continuations.questions.template);
        var json = resp.continuations.questions.template;

        for (var q = 0; q < prompts.length; q++) {
            json.answers[prompts[q]].push(document.querySelector('input[name="' + prompts[q] + '"]:checked').value);

        }

        console.log(json);
        const rawResponse = await fetch('https://production.idresponse.com/process/continue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });
        const content = await rawResponse.json();
        console.log(content);


        if (content.result.action == "PASS") {
            document.getElementById("isVerified").innerHTML = "Yup. Verified by ePluribus!";

        }

    };





    // var json = {
    //     "answers": {
    //         "company0": ["None of the above"],
    //         "phone1": ["(408) 819-4340"],
    //         "streetname3": ["None of the above"],
    //         "county2": ["SANTA CLARA"]
    //     }
    // }





    // const rawResponse = await fetch('https://production.idresponse.com/process/continue', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer wixdgwaem9wk0dkhvzfr80vjymowesne'
    //     },
    //     body: JSON.stringify(json)
    // });

    // const content = await rawResponse.json();
    // console.log(content);

}

async function submitedIdPicture() {
    var json = {
        "user": "ws@epluribus.io",
        "pass": "dfghrkj58034y5uvg",
        "service": "DCAMSPLUS5.0.TEST",
        "target": {
            "license": {
                "front": front,
                "back": back,
                "state": "CA",
                "region": "united states"
            },
            "age": "21+"
        }
    };

    const rawResponse = await fetch('https://docs.idresponse.com/process/comprehensive/gateway', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });
    const content = await rawResponse.json();

    if (content.result.action == 'PASS') {
        document.getElementById("isVerified").innerHTML = "Yup. Verified by ePluribus!";
    }

    console.log(content);
}

var front;
var back;


function front(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        front = reader.result.substring(23);
    }
    var str = reader.readAsDataURL(file);
}

function back(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        back = reader.result.substring(23);
    }
    reader.readAsDataURL(file);
}
