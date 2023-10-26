# RADIO HEBAT
RADIO HEBAT, Online Radio Streaming Berbasis Website dengan Penerapan Protokol WebRTC dan socket.io.

## Langkah Instalasi
### Prerequisites
- Make sure nodejs installed to your computer
- Generate Self-signed certificate (WebRTC works only on https) using mkcert
- Drop .pem file to folder /ssl_key
- Create .env in root folder project
- Add SSL_KEY and SSL_CERT environment variable (.env.example for example .env variable)

### Panduan Instalasi Windows
1. masuk ke direktori project dan jalankan perintah "npm install" untuk menginstall dependency
2. jalankan perintah `npm install -g nodemon`
3. Unduh `chocolatey.msi` (unduh versi terbarunya pada asset) pada link berikut https://github.com/chocolatey/choco/releases
4. buka file `.msi` tersebut, kemudian install seperti biasa
5. setelah instalasi chocolaty selesai silahkan buka command promt administrator. Untuk memeriksa chocolatey telah terinstal atau belum, anda dapat mengetikkan perintah `choco` pada terminal administrator
6. jalankan perintah `choco mkcert install`
7. jalankan perintah `mkcert` untuk memeriksa apakah sudah terinstall atau belum
8. jalankan perintah `mkcert -install`. Silahkan klik yes jika terdapat pop-up
9. pergi ke direktori project dan pindahkan direktori terminal ke folder `ssl-key`
10. jika terminal sudah berada di direktori tersebut silahkan jalankan perintah `mkcert localhost`
11. maka pada folder project bernama `ssl-key` akan bertambah 2 file baru yaitu `localhost-key.pem` dan `localhost.pem`
12. silahkan buat file `.env` pada root direktori project sesuai dengan `.env.example` yang diberikan
13. silahkan jalankan perintah `npm run dev` pada root direktori project
14. pastikan `https://localhost:3000` berjalan pada browser. Jika berhasil maka akan tampil `Cannot GET /`
15. setelah berhasil silahkan pergi ke website https://xirsys.com/
16. kemudian daftarkan diri kalian
17. buat chanel pertamamu disana
18. setelah membuat chanel pada bagian kiri atas pilih `Static TURN Credentials`
19. pilih `oke` atau `yes`
20. kemudian `copy` credentials tersebut
21. dan yang terakhir `paste` credentials tersebut ke file `public/js/broadcast.js` dan `public/js/listen.js` pada line 20 atau `iceserver`
contohnya seperti ini :
```javascript
    const iceServers = {
//  TODO
    iceServers: [{
        urls: [ "..." ]
    }, {
        username: "...",
        credential: "...",
        urls: [
            "...",
            "...",
            "...",
            "...",
            "...",
            "..."
        ]
    }]
};
```
22. buka terminal baru dan arahkan ke root direktori project
23. jalankan perintah `npm install flowbite`
24. kemudian jalankan perintah `npm run tailwind`

### Cara Menjalankan Radio-Broadcast
1. pergi ke link berikut `https://localhost:3000/radio/broadcast` (windows). untuk os lain dapat disesuaikan dengan mkcert yang dijalankan
2. pilih salah satu radio
3. upload file mp3 yang akan kamu siarkan
4. klik button `broadcast now`
5. kamu bisa `mute` atau `unmute` untuk monitoring audio

### Panduan Menjalankan Radio-Client
1. pergi ke link berikut `https://localhost:3000/radio/listen?id=1` (windows). untuk os lain dapat disesuaikan dengan mkcert yang dijalankan
2. pastikan terdapat parameter id dan nilainya jika menggunakan project ini maka nilai id nya adalah 1 - 6
3. anda bisa klik play, pause, next, dan previous untuk menjalankan radionya
4. radio yang dapat menyala tergantung dari banyak broadcasr radio yang kamu jalankan.

## Fitur
- Play Radio
- Stop Radio
- Change Radio Channel
- broadcast
- mute monitoring audio
- unmute monitoring audio
