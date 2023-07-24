# Guide: Deploying a Node.js Project to Heroku from Bitbucket

## Prerequisites

- Ensure you have the Heroku CLI installed on your machine.
- Make sure your project has a `package.json` file with all the required dependencies.

# You can Install Heroku Cli Using this command

```bash
brew tap heroku/brew && brew install heroku
```

## Step 1: Log in to Heroku

```bash
heroku login
```

This will open a web browser where you can log in with your Heroku account credentials.

# Step 2: Create a Heroku App

```bash
heroku create your-app-name
```

Replace **your-app-name** with the desired name for your Heroku app. The app name should be unique on Heroku.

# Step 3: Set Up Environment Variables

**STRIPE_API_SECRET_KEY:** This is a configuration variable that holds the secret API key for Stripe. It is used to authenticate requests made to the Stripe API on behalf of your application.

To set this environment variable in a Heroku environment, you can use the heroku **config:set** command as shown in your provided bash code. Replace KEY with **STRIPE_API_SECRET_KEY** and value with the actual secret key you have for Stripe:

```bash
heroku config:set STRIPE_API_SECRET_KEY=your_actual_stripe_api_secret_key
```

# Step 4: Add Repository as Remote

```bash
git remote add https://github.com/ValerioP-developer/basic-stripe-api/tree/main
```

# Step 5: Push to Heroku

```bash
git push heroku master
```

This will deploy your project to Heroku and trigger the build process.
Replace **master** with the correct branch name if your main branch has a different name.

# Step 6: Verify the Deployment

```bash
heroku open
```

This will open your app in a new browser tab.
