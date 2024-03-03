'use strict';

const fs = require('node:fs');
const http2 = require('node:http');
const WebSocket = require('ws');

const index = fs.readFileSync('./index.html', 'utf8');
const data = fs.readFileSync('./data.json', 'utf8');

const routing = {
  '/': (req, res) => {
    res.end(index);
  },
  '/api/http': (req, res) => {
    const headers = {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    res.end(JSON.stringify(data));
  },
  '/api/sse': (req, res) => {
    const headers = {
      // Тип соединения 'text/event-stream' необходим для SSE
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*',
      // Отставляем соединение открытым 'keep-alive'
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    // Данные будут отправляться каждые 2 секунды
    const timer = setInterval(async () => {
      // если отправлено 10 раз, закрываю соединение
      if (sseCount > 10) {
        clearInterval(timer)
        res.write('id: -1\ndata:\n\n')
        res.end()
        return
      }

      // Формирование данных:
      // Когда EventSource получает множество последовательных
      // строк, начинающихся с data: они объединяются, вставляя
      // символ новой строки между ними. Завершающие символы
      // новой строки удаляются.
      // Двойные символы конца строки \n\n обозначают конец
      // события.
      const sendData = `data: ${JSON.stringify(data)}\n\n`;

      res.write(sendData);

      sseCount++
    }, 2000)
  },
};


const key = fs.readFileSync('./cert/key.pem');
const cert = fs.readFileSync('./cert/cert.pem');
const options = { key, cert, allowHTTP1: true };

const server = http2.createServer(
  // options,
  (req, res) => {
    const route = routing[req.url];
    if (!route) {
      res.end('not found');
      return;
    }
    route(req, res);
  });

const ws = new WebSocket.Server({ server });

ws.on('connection', (connection, _) => {
  // Данные будут отправляться каждые 2 секунды
  const timer = setInterval(async () => {
    // если отправлено 10 раз, закрываю соединение
    if (sseCount > 10) {
      clearInterval(timer)
      res.send('-1')
      connection.close();
      return
    }

    connection.send(JSON.stringify(data));

    webSocketCount++
  }, 2000)
});

server.listen(8000);
console.log('Open: http://127.0.0.1:8000');

let sseCount = 0;
let webSocketCount = 0;