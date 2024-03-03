# Из чего же состоят http и websocket?

Для запуска необходимо установить node.js

## Запуск

Сперва устанавливаем зависимости: `npm install`

Чтобы пустить трафик через TLS, необходимо выпустить сертификат: `sh .cert/generate.sh`

Чтобы расшифровать `TLS`, необходимо залогировать сессионные ключи

1. `export SSLKEYLOGFILE=~/path/to/keylogfile.txt`
2. `open -a Firefox`
3. `open -a Wireshark`

После этого можно запустить сервер `node server.js`.

Не забудь в настройках Wireshark в Protocols -> TLS указать путь к `SSLKEYLOGFILE`.
