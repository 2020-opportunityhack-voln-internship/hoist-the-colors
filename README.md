# hoist-the-colors
Problem Statement 4 - #risk-scoring


## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Installation](#installation)

## General info
Non-profits need a way to vet the standing of people, specifically for pets, as they want to be sure they are going to a nice home. Given a social media profile (and potentially their network) that someone has granted access to, analyze the content of their posts to create a risk score to understand if there are any red flags for pet adoption.
	
## Technologies
Project is created with:
* Django version: 3.0.3
* tweepy version: 3.8.0

## Installation

### Clone
Clone this repo to your local machine using https://github.com/2020-opportunityhack-voln-internship/hoist-the-colors.git
	
### Setup

**The dependencies for this project are present in `environment.yml`**

* To create an environment, execute
    ```shell script
    conda env create -f config/environment.yml 
    ```
* When dependencies are added to `environment.yml` execute
    ```shell script
    conda deactivate
    conda env update -f config/environment.yml --prune
    conda activate <env_name>
    ```
* To remove an environment
    ```shell script
    conda remove --name <env_name> --all
    ```
    
    
    
    
    
**Add a `credentials.json` file with your Twitter and Facebook credentials**

```json
{
  "twitter_consumer_key": "YOUR_TWITTER_CONSUMER_KEY",
  "twitter_consumer_secret": "YOUR_TWITTER_CONSUMER_SECRET",
  "facebook_client_id" : "YOUR_FACEBOOK_CLIENT_ID",
  "facebook_client_secret" : "YOUR_FACEBOOK_CLIENT_SECRET"
}
```



**Run the application by navigating to the Django Project and starting the server**
    ```shell script
    cd Risk_Analysis
    python manage.py runserver
    ```
Go to link https://localhost:8000/authenticate to authenticate users
