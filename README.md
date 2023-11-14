# UofTBuzz 🐝

## About the Project
Hello U of T folks! 🌟 UofTBuzz is a digital bulletin board designed especially for our community. It's a space where both event organizers and students can post and discover upcoming events with ease. Event hosts can share all the essential details, making it simpler for attendees to find and join. Say goodbye to the old-school method of physically pinning flyers and enjoy a centralized platform for all our campus happenings.

## Tech Stack 

## Getting Started 
- Make sure you have Node.js installed
- Create your own virtual environment & install requirements from requirements.txt
- To start the frontend, navigate to ```react-frontend``` and run ```npm start```
- To start the backend, navigate to ```flask-api``` and run ```flask run```

## Unit Tests 
Unit tests can be found in flask-api/test/app_test.py
To run the unit tests, navigate to ```flask-api``` and run ```python -m pytest```

## Running the app locally
- To run the app locally, add a proxy to the frontend package.json file to point to the backend server
  - example: ```"proxy": "http://localhost:5000"```
- Add `IMAGES` folder to `flask-api` directory

## Contributing
Please read the contribution guidelines [here](Contribution.md). 

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11974770&assignment_repo_type=AssignmentRepo)
