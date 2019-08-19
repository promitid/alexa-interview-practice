/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('ask-sdk-core');

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.eba05c8f-eeaf-4aab-829c-a834874e5aef';

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.questions = data;
        attributes.currentQ = '';
        attributes.deckLength -= data.length;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        return handlerInput.responseBuilder
            .speak(welcomeMessage)
            .reprompt(helpMessage)
            .getResponse();
    },
  };
  
const QuestionHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      console.log("Inside QuestionHandler");
      console.log(JSON.stringify(request));
      return request.type === "IntentRequest" &&
             (request.intent.name === "GetNewQuestion");
    },
    handle(handlerInput) {
      const response = handlerInput.responseBuilder;
      var speakOutput = getQuestion(handlerInput);
  
      return response.speak(speakOutput)
                     .reprompt(repromptOutput)
                     .getResponse();
    },
  };

const SkipHandler = {
    canHandle(handlerInput) {
        console.log("Inside SkipHandler");
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'SkipIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        // add back to session attributes 

        const question = getQuestion(handlerInput);
        return response.speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
}

const RepeatHandler = {
    canHandle(handlerInput) {
        console.log("Inside RepeatHandler");
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'RepeatQuestion';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const question = attributes.currentQ

        return handlerInput.responseBuilder
            .speak(question)
            .reprompt(question)
            .getResponse();
    },
  };
  
const HelpHandler = {
    canHandle(handlerInput) {
      console.log("Inside HelpHandler");
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' &&
             request.intent.name === 'AMAZON.HelpHandler';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(helpMessage)
        .getResponse();
    },
  };
  
const ExitHandler = {
    canHandle(handlerInput) {
      console.log("Inside ExitHandler");
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      const request = handlerInput.requestEnvelope.request;
  
      return request.type === `IntentRequest` && (
                request.intent.name === 'AMAZON.StopIntent' ||
                request.intent.name === 'AMAZON.PauseIntent' ||
                request.intent.name === 'AMAZON.CancelIntent'
             );
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(exitSkillMessage)
        .getResponse();
    },
  };
  
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      console.log("Inside SessionEndedRequestHandler");
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
      return handlerInput.responseBuilder.getResponse();
    },
  };
  
const ErrorHandler = {
    canHandle() {
      console.log("Inside ErrorHandler");
      return true;
    },
    handle(handlerInput, error) {
      console.log("Inside ErrorHandler - handle");
      console.log(`Error handled: ${JSON.stringify(error)}`);
      console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);
  
      return handlerInput.responseBuilder
        .speak(helpMessage)
        .reprompt(helpMessage)
        .getResponse();
    },
  };

// CONSTANTS
const data = ['What are your strengths?', 
'What are your weaknesses?', 
'Tell me about a class or internship on your resume.', 
'How has your internship experience or classwork prepared you for the position you’re applying to?', 
'What was your favorite class?',
'What was your least favorite class?',
'What activities do you do outside of work or school?',
'Give me an example of a time when you worked on a team. What was your role?',
'Give me an example of a time you faced a conflict while working on a team. How did you handle that?',
'Describe a time where you disagreed with a coworker or teammate on a project.',
'Tell me about a time you were under a lot of pressure. What was going on, and how did you get through it?',
'Tell me about a time you failed. How did you deal with the situation?',
'When did you take a risk, make a mistake, or fail? How did you respond, and how did you grow from that experience?',
'Describe a time you took the lead on a project.']; // starter questions

const skillBuilder = Alexa.SkillBuilders.custom();
const welcomeMessage = `Starting Interview Practice Skill. Your first question is: `;
const exitSkillMessage = `Exiting Interview Practice.`;
const helpMessage = ``;

// HELPERS
function getQuestion(handlerInput) {
    console.log("Getting Question");
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    //GENERATING THE RANDOM QUESTION
    const random = Math.floor(Math.random() * attributes.deckLength);
    const item = data[random];
    const question = item[0];
    
    //SET QUESTION DATA TO ATTRIBUTES
    attributes.currentQ = question;
    attributes.currentItem = item;
    attributes.deckLength -= 1;
    //SAVE ATTRIBUTES
    handlerInput.attributesManager.setSessionAttributes(attributes);
  
    return question;
  }

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    QuestionHandler,
    RepeatHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

