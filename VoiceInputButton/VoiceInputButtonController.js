({
    doInit : function(component, event, helper) {
        var action = component.get("c.getCase");
        action.setParams({
            caseId : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.case", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    startRecording : function(component, event, helper) {
        var micButton = component.find("micButton");
        var descriptionField = component.find("descriptionField");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({audio:true})
            .then(function(stream) {
                var recognition = new webkitSpeechRecognition();
                recognition.lang = "en-US";
                recognition.continuous = true;
                //recognition.interimResults = true;
                recognition.start();
                micButton.set("v.label", "🔴");
                recognition.onresult = function(event) {
                    var transcript = "";
                    for (var i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    var pause = Math.floor(Math.random() * 5 + 1) * 1000; // random pause between 1 and 5 seconds
                    setTimeout(function() {
                        descriptionField.set("v.value", descriptionField.get("v.value") + transcript); // append the transcript to the existing value
                    }, pause);
                };
                recognition.onend = function() {
                    micButton.set("v.label", "🎤");
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                };
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    },
    
    clearDescription : function(component, event, helper) {
        var descriptionField = component.find("descriptionField");
        descriptionField.set("v.value", ""); // clear the value of the description field
    },
    
    saveRecord : function(component, event, helper) {
        var action = component.get("c.updateCase");
        action.setParams({
            caseObj : component.get("v.case")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "The case has been updated successfully."
                });
                toastEvent.fire();
                $A.get("e.force:refreshView").fire();
                var recordLoader = component.find("recordLoader");
                recordLoader.reloadRecord();
            }
        });
        $A.enqueueAction(action);
    },
    
    cancelOperation : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire(); // close the quick action modal
    }
})