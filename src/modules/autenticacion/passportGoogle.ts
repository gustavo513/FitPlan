import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "http://localhost:3000/autenticacion/google/callback"
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try{
                let metAut = await prisma.metodoAut.findUnique({
                    where: {
                        id_externo: profile.id
                    }
                });

                let usuario;
    
                if(!metAut){
                    usuario = await prisma.usuario.create({
                        data: {
                            //nombre_usuario: profile.displayName,
                            email: profile.emails?.[0].value!,
                            confirm_email: 1,
                            estado: 1
                        }
                    });
    
                    metAut = await prisma.metodoAut.create({
                        data: {
                            id_proveedor: 1,
                            id_externo: profile.id,
                            id_usuario: usuario?.id_usuario
                        }
                    });
                }
                else{
                    usuario = await prisma.usuario.findUnique({
                        where: {
                            id_usuario: metAut?.id_usuario
                        }
                    });
                }
    
                const token = jwt.sign({id: usuario?.id_usuario}, process.env.JWT_SECRET_KEY as string, {expiresIn: "24h"});
    
                return done(null, {usuario, token});
            }
            catch(error: any){
                done(error);
            }
        }
    ),
);