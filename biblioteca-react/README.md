# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Recuperação de senha

O cadastro solicita um e-mail para que a API Django possa enviar o link de redefinição. Configure estas variáveis no ambiente do servidor Django; não grave credenciais SMTP no código:

- `EMAIL_HOST`
- `EMAIL_PORT` (padrão: `587`)
- `EMAIL_USE_TLS` (padrão: `true`)
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- `DEFAULT_FROM_EMAIL`
- `FRONTEND_URL` (URL pública desta aplicação, usada no link do e-mail)

Contas criadas antes desta alteração precisam ter um e-mail válido cadastrado no Django Admin para receber o link.
