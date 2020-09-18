import nodemailer from 'nodemailer';

export class SendMail {

    constructor(email: string, password: string, name: string) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 587,
            secure: false,
            auth: {
              user: 'login of the used mail account',
              pass: 'password of the used mail account'
            }
        });
        this.sendMail(transporter, email, password, name);
    }

    async sendMail(transporter: any, email: string, password: string, name: string) {
        try {
            let result = await transporter.sendMail({
                from: '"Tim" <piskunovichd@bk.ru>',
                to: `${email}`,
                subject: "Message from Shop",
                text: "This message was sent from Shop.",
                html: `Hello, ${name}. Your password ${password}`
            });
        } catch (err) {
            console.log(err);
        }
    }
}