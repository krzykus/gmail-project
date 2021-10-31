const { google } = require('googleapis');

/**
 * Gmail controller - set up gmail routes
 *
 * @param {Object} app Express app object
 * @param {Object} googleCredentials google client credentials
 */
const GmailController = (app, googleCredentials) => {
    const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

    const getGoogleAuthClient = (credentials) => {
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);
        return oAuth2Client;
    }

    const authClient = getGoogleAuthClient(googleCredentials);

    app.get('/gmail/loginURL', (req, res) => {
        const authUrl = authClient.generateAuthUrl({
            scope: SCOPES,
        });
        res.send(JSON.stringify(authUrl));
    });

    app.get('/gmail/loginCallback', (req, res) => {
        console.log(req.url);
        //Get the tokens from the code
        //Send back a script to close the popup and return to the app
        res.send("<script>window.close('','_parent','');</script>");
    });
 
    app.get('/gmail/verifyLogin', (req,res) => {
        //TODO:: Should return if the user is logged and it's details
        //TODO:: Consider creating user domain shared with other login methods
        res.send("OK");
    });
    
};

module.exports = GmailController