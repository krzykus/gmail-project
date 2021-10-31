const { google } = require('googleapis');
const url = require('url');
/**
 * Gmail controller - set up gmail routes
 *
 * @param {Object} app Express app object
 * @param {Object} googleCredentials google client credentials
 */
const GmailController = (app, googleCredentials) => {
    const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/userinfo.email'];

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
        const queryObject = url.parse(req.url,true).query;
        getToken(queryObject.code);
        //TODO:: set session for the user

        //Send back a script to close the popup and return to the app
        res.send("<script>window.close('','_parent','');</script>");
    });
 
    app.get('/gmail/verifyLogin', (req,res) => {
        //TODO:: Should return if the user is logged and it's details
        //TODO:: Consider creating user domain shared with other login methods
        res.send("OK");
    });

    ////////////////////////////////////////////////////
    //TODO:: move it to separate file. Shouldn't be in controller
    ////////////////////////////////////////////////////
    const getToken = (code) => {
        authClient.getToken(code, (err, token) => { //TODO:: authClient should have been passed
            if (err) return console.error('Error retrieving access token', err);
            authClient.setCredentials(token);
            //TODO:: Save tokens in DB (When there will be one);

            getRecentMail(authClient);
            //getMail shouldn't really be here but I'm slightly over time limit...
        });
    }

    const getRecentMail = (auth, limit = 5) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.list(
            {        
                userId: 'me',
                q:'in:sent', //Let's get the sent mail
                maxResults: limit
            }, (err, res) => {
                if (err) {
                    //TODO:: Logging? Passing back information about error
                    return;
                }
                //TODO:: Should also check if res/data/messages is not empty etc
        
                //TODO:: Should loop/map all the messages also not the first one only
                //TODO:: this could run async as users may have a lot of emails and looping through all the emails may take time
                getMail(res.data.messages[0].id, auth);
            }
        );
    }

    const getMailCallback = (err,res) => {//TODO:: needs renaming also could do without a callback
        console.log(err);
        console.log(res);
        if (err) {
            //TODO:: Logging? Passing back information about error
            return;
        }
        //TODO:: Should also check if res/data/etc is not empty etc
        console.log(res.data);
    }

    const getMail = (msgId, auth) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.get({
            userId:'me',
            id: msgId ,
        },getMailCallback)
    }
};

module.exports = GmailController