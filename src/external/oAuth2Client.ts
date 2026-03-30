import { OAuth2Client } from "google-auth-library";

export const verificarIdToken = async(idToken: string) => {

    const oauthClient = new OAuth2Client();

    try{
        const resultado = await oauthClient.verifyIdToken({
            idToken,
            audience: process.env.APP_GOOGLE_CLIENT_ID
        });

        return resultado.getPayload();
    }
    catch(error){
        console.log(error);
    }

}