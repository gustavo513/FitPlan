import nodemailer from 'nodemailer';

const trasnportador = nodemailer.createTransport({
    service: 'Gmail', //proveedor de email
    auth: {
        user: 'gustavoortigoza06@gmail.com',
        pass: 'awjodqgpkkwmgcyw'
    }
});

export const enviarEmail = async (to: string, subject: string, text: string) => {
    await trasnportador.sendMail({
        from: 'gustavoortigoza06@gmail.com',
        to,
        subject,
        text
    });
}