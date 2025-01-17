import nodemailer from 'nodemailer';

const trasnportador = nodemailer.createTransport({
    service: 'Gmail', //proveedor de email
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_USER
    }
});

export const enviarEmail = async (to: string, subject: string, text: string) => {
    await trasnportador.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
}