# Из чего же состоят http и websocket?

Для запуска необходимо установить node.js

## Запуск

Чтобы расшифровать `TLS`, необходимо залогировать сессионные ключи

1. `export SSLKEYLOGFILE=~/path/to/keylogfile.txt`
2. `open -a Firefox`
3. `open -a Wireshark`

После этого можно запустить сервер:

`node server.js`
